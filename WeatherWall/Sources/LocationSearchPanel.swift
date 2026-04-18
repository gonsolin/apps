import Cocoa
import MapKit

/// Result from the location search panel — name + optional coordinates.
struct LocationSearchResult {
    let name: String
    let latitude: Double?
    let longitude: Double?
}

/// A panel that provides Google Maps-style predictive location search
/// using Apple's MKLocalSearchCompleter. Shows a text field with a
/// dropdown table of suggestions that updates as the user types.
class LocationSearchPanel: NSObject, MKLocalSearchCompleterDelegate, NSTextFieldDelegate, NSTableViewDelegate, NSTableViewDataSource {

    private var window: NSWindow!
    private var textField: NSTextField!
    private var tableView: NSTableView!
    private var scrollView: NSScrollView!
    private var saveButton: NSButton!
    private var cancelButton: NSButton!

    private let completer = MKLocalSearchCompleter()
    private var results: [MKLocalSearchCompletion] = []
    private var completion: ((LocationSearchResult?) -> Void)?

    override init() {
        super.init()
        completer.delegate = self
        completer.resultTypes = [.address, .pointOfInterest]
        buildWindow()
    }

    // MARK: - Public

    /// Show the panel and call completion with the selected location, or nil if cancelled.
    func show(currentValue: String?, completion: @escaping (LocationSearchResult?) -> Void) {
        self.completion = completion
        textField.stringValue = currentValue ?? ""
        results = []
        tableView.reloadData()
        updateSaveButton()

        NSApp.activate(ignoringOtherApps: true)
        window.center()
        window.makeKeyAndOrderFront(nil)
        window.makeFirstResponder(textField)

        if let val = currentValue, !val.isEmpty {
            completer.queryFragment = val
        }
    }

    // MARK: - Build UI

    private func buildWindow() {
        let w: CGFloat = 480
        let h: CGFloat = 400

        window = NSWindow(contentRect: NSRect(x: 0, y: 0, width: w, height: h),
                          styleMask: [.titled, .closable], backing: .buffered, defer: false)
        window.title = "Search Location"
        window.isReleasedWhenClosed = false

        let content = window.contentView!

        // Text field
        textField = NSTextField(frame: NSRect(x: 16, y: h - 52, width: w - 32, height: 28))
        textField.placeholderString = "Search for a city, neighborhood, or place…"
        textField.font = NSFont.systemFont(ofSize: 14)
        textField.delegate = self
        content.addSubview(textField)

        // Table view in scroll view
        scrollView = NSScrollView(frame: NSRect(x: 16, y: 52, width: w - 32, height: h - 112))
        scrollView.hasVerticalScroller = true
        scrollView.borderType = .bezelBorder

        tableView = NSTableView()
        let column = NSTableColumn(identifier: NSUserInterfaceItemIdentifier("location"))
        column.title = "Suggestions"
        column.width = w - 52
        tableView.addTableColumn(column)
        tableView.headerView = nil
        tableView.rowHeight = 44
        tableView.delegate = self
        tableView.dataSource = self
        tableView.doubleAction = #selector(rowDoubleClicked)
        tableView.target = self
        tableView.action = #selector(rowClicked)

        scrollView.documentView = tableView
        content.addSubview(scrollView)

        // Buttons
        saveButton = NSButton(title: "Save", target: self, action: #selector(saveTapped))
        saveButton.frame = NSRect(x: w - 96, y: 12, width: 80, height: 32)
        saveButton.bezelStyle = .rounded
        saveButton.keyEquivalent = "\r"
        content.addSubview(saveButton)

        cancelButton = NSButton(title: "Cancel", target: self, action: #selector(cancelTapped))
        cancelButton.frame = NSRect(x: w - 186, y: 12, width: 80, height: 32)
        cancelButton.bezelStyle = .rounded
        cancelButton.keyEquivalent = "\u{1b}"
        content.addSubview(cancelButton)
    }

    private func updateSaveButton() {
        saveButton.isEnabled = !textField.stringValue
            .trimmingCharacters(in: .whitespacesAndNewlines).isEmpty
    }

    // MARK: - Resolve coordinates from a search completion

    private func resolveAndReturn(_ searchCompletion: MKLocalSearchCompletion) {
        let request = MKLocalSearch.Request(completion: searchCompletion)
        let search = MKLocalSearch(request: request)
        search.start { [weak self] response, error in
            guard let self = self else { return }
            let name = "\(searchCompletion.title)\(searchCompletion.subtitle.isEmpty ? "" : ", \(searchCompletion.subtitle)")"
            if let item = response?.mapItems.first {
                let coord = item.placemark.coordinate
                self.window.orderOut(nil)
                self.completion?(LocationSearchResult(name: name,
                                                      latitude: coord.latitude,
                                                      longitude: coord.longitude))
            } else {
                // Couldn't geocode — return name only
                self.window.orderOut(nil)
                self.completion?(LocationSearchResult(name: name, latitude: nil, longitude: nil))
            }
        }
    }

    // MARK: - Actions

    @objc private func saveTapped() {
        let row = tableView.selectedRow
        if row >= 0, row < results.count {
            // Resolve the selected suggestion to get coordinates
            resolveAndReturn(results[row])
        } else {
            // Free-text entry — try to geocode it
            let value = textField.stringValue.trimmingCharacters(in: .whitespacesAndNewlines)
            guard !value.isEmpty else {
                window.orderOut(nil)
                completion?(nil)
                return
            }
            let request = MKLocalSearch.Request()
            request.naturalLanguageQuery = value
            let search = MKLocalSearch(request: request)
            search.start { [weak self] response, error in
                guard let self = self else { return }
                if let item = response?.mapItems.first {
                    let coord = item.placemark.coordinate
                    self.window.orderOut(nil)
                    self.completion?(LocationSearchResult(name: value,
                                                          latitude: coord.latitude,
                                                          longitude: coord.longitude))
                } else {
                    self.window.orderOut(nil)
                    self.completion?(LocationSearchResult(name: value, latitude: nil, longitude: nil))
                }
            }
        }
    }

    @objc private func cancelTapped() {
        window.orderOut(nil)
        completion?(nil)
    }

    @objc private func rowClicked() {
        let row = tableView.selectedRow
        guard row >= 0, row < results.count else { return }
        let result = results[row]
        textField.stringValue = "\(result.title)\(result.subtitle.isEmpty ? "" : ", \(result.subtitle)")"
        updateSaveButton()
    }

    @objc private func rowDoubleClicked() {
        let row = tableView.selectedRow
        guard row >= 0, row < results.count else { return }
        resolveAndReturn(results[row])
    }

    // MARK: - NSTextFieldDelegate

    func controlTextDidChange(_ obj: Notification) {
        let query = textField.stringValue.trimmingCharacters(in: .whitespacesAndNewlines)
        updateSaveButton()
        if query.count >= 2 {
            completer.queryFragment = query
        } else {
            results = []
            tableView.reloadData()
        }
    }

    // MARK: - MKLocalSearchCompleterDelegate

    func completerDidUpdateResults(_ completer: MKLocalSearchCompleter) {
        results = completer.results
        tableView.reloadData()
    }

    func completer(_ completer: MKLocalSearchCompleter, didFailWithError error: Error) {
        // Silently ignore
    }

    // MARK: - NSTableViewDataSource

    func numberOfRows(in tableView: NSTableView) -> Int {
        results.count
    }

    // MARK: - NSTableViewDelegate

    func tableView(_ tableView: NSTableView, viewFor tableColumn: NSTableColumn?, row: Int) -> NSView? {
        let id = NSUserInterfaceItemIdentifier("LocationCell")
        var cell = tableView.makeView(withIdentifier: id, owner: nil) as? NSTableCellView

        if cell == nil {
            cell = NSTableCellView(frame: NSRect(x: 0, y: 0, width: 400, height: 44))
            cell?.identifier = id

            let titleLabel = NSTextField(labelWithString: "")
            titleLabel.font = NSFont.systemFont(ofSize: 13, weight: .medium)
            titleLabel.translatesAutoresizingMaskIntoConstraints = false
            cell?.addSubview(titleLabel)
            cell?.textField = titleLabel

            let subtitleLabel = NSTextField(labelWithString: "")
            subtitleLabel.font = NSFont.systemFont(ofSize: 11)
            subtitleLabel.textColor = .secondaryLabelColor
            subtitleLabel.translatesAutoresizingMaskIntoConstraints = false
            subtitleLabel.tag = 100
            cell?.addSubview(subtitleLabel)

            NSLayoutConstraint.activate([
                titleLabel.topAnchor.constraint(equalTo: cell!.topAnchor, constant: 4),
                titleLabel.leadingAnchor.constraint(equalTo: cell!.leadingAnchor, constant: 8),
                titleLabel.trailingAnchor.constraint(equalTo: cell!.trailingAnchor, constant: -8),
                subtitleLabel.topAnchor.constraint(equalTo: titleLabel.bottomAnchor, constant: 1),
                subtitleLabel.leadingAnchor.constraint(equalTo: cell!.leadingAnchor, constant: 8),
                subtitleLabel.trailingAnchor.constraint(equalTo: cell!.trailingAnchor, constant: -8),
            ])
        }

        let result = results[row]
        cell?.textField?.stringValue = result.title
        if let sub = cell?.viewWithTag(100) as? NSTextField {
            sub.stringValue = result.subtitle
        }

        return cell
    }
}
