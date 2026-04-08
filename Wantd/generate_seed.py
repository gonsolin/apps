import json
import random
from datetime import datetime, timedelta, timezone

random.seed(42)

def rdate(days_ago_max=90):
    offset = random.randint(0, days_ago_max * 24 * 60)
    dt = datetime(2026, 3, 27, 16, 39, 0, tzinfo=timezone.utc) - timedelta(minutes=offset)
    return dt.isoformat().replace('+00:00', 'Z')

# ── LOCATION POOLS ──────────────────────────────────────────────────────────────
# ~30% USA, ~15% Europe, ~15% East Asia, ~10% LATAM, ~10% UK/CAN/AUS, ~20% ROW
locations_usa = [
    ("New York, NY", ["James W","Maria G","David K","Sophia R","Michael T","Olivia N","Daniel H","Emily C","Chris P","Sarah M","Robert L","Jessica B","Kevin O","Ashley F","Brian S","Amanda J"]),
    ("Los Angeles, CA", ["Carlos M","Ashley T","Brandon K","Jennifer W","Kevin L","Nicole R","Tyler B","Brittany H","Marcus C","Lauren S","Derek P","Vanessa O","Justin F","Kayla N","Sean G","Brittney A"]),
    ("Chicago, IL", ["Michael A","Heather B","Ryan C","Stephanie D","Patrick E","Angela F","Thomas G","Rachel H","William I","Megan J"]),
    ("Houston, TX", ["Jose R","Maria L","Roberto G","Ana F","Carlos H","Sandra M","Miguel T","Patricia C","Luis B","Carmen A"]),
    ("Phoenix, AZ", ["Tyler W","Jessica N","Cody R","Amber M","Josh T","Brittany H","Kyle B","Amanda C","Dustin F","Kayla G"]),
    ("Philadelphia, PA", ["Christopher M","Danielle B","Anthony R","Tiffany N","Marcus L","Keisha W","Darnell T","Latoya H","Terrence C","Shante F"]),
    ("San Antonio, TX", ["Juan G","Rosa L","Eduardo M","Isabella R","Marco T","Valentina H","Diego C","Camila B","Alejandro F","Mariana N"]),
    ("San Diego, CA", ["Jake H","Samantha L","Ethan M","Madison R","Nathan T","Olivia B","Logan C","Emma F","Austin G","Ava N"]),
    ("Dallas, TX", ["Derek W","Courtney B","Lance R","Crystal M","Jared T","Tammie H","Brent C","Felicia N","Todd F","Monique G"]),
    ("San Jose, CA", ["Priya S","Rahul K","Ananya B","Arjun M","Divya R","Vikram T","Meena H","Rajan C","Sunita F","Aakash N"]),
    ("Austin, TX", ["Zach M","Taylor B","Hunter R","Haley T","Blake C","Kayla N","Chase F","Mackenzie G","Garrett H","Peyton L"]),
    ("Jacksonville, FL", ["Terry W","Donna B","Larry R","Beverly M","Jerry T","Deborah H","Gary C","Carol N","Ronald F","Sharon G"]),
    ("Seattle, WA", ["Alex K","Mia T","Ryan B","Emma R","Ethan M","Sophia N","Noah C","Ava F","Liam G","Isabella H"]),
    ("Denver, CO", ["Zoe W","Owen B","Lily R","Lucas M","Chloe T","Mason H","Avery C","Elijah N","Scarlett F","Aiden G"]),
    ("Portland, OR", ["Finn M","Isla B","Jasper R","Wren T","Sage C","River N","Aspen F","Cedar G","Quinn H","Rowan L"]),
    ("Atlanta, GA", ["DeAndre W","Jasmine B","Malik R","Tanisha M","Jerome T","Keisha H","Darius C","Monique N","Andre F","Shanice G"]),
    ("Minneapolis, MN", ["Erik L","Ingrid B","Lars M","Astrid R","Bjorn T","Sigrid H","Olaf C","Freya N","Sven F","Helga G"]),
    ("Nashville, TN", ["Billy R","Carrie M","Johnny B","Dolly T","Waylon H","Patsy C","Hank N","Loretta F","Garth G","Tammy L"]),
    ("Las Vegas, NV", ["Victor M","Crystal B","Dion R","Roxanne T","Ace H","Diamond C","Blaze N","Stella F","Reno G","Vegas L"]),
    ("Boston, MA", ["Connor M","Bridget B","Declan R","Siobhan T","Liam H","Aoife C","Padraig N","Fionnuala F","Cormac G","Cliona L"]),
]
locations_europe = [
    ("London, UK", ["Oliver W","Charlotte B","Harry R","Amelia M","George T","Isla H","Archie C","Poppy N","Alfie F","Daisy G","James L","Emily K"]),
    ("Paris, France", ["Pierre D","Marie L","Jean-Paul B","Sophie M","François R","Isabelle T","Nicolas H","Camille C","Julien N","Céline F","Antoine G","Margot L"]),
    ("Berlin, Germany", ["Hans M","Greta B","Klaus R","Heidi T","Dieter H","Ursula C","Wolfgang N","Hildegard F","Franz G","Lieselotte L"]),
    ("Madrid, Spain", ["Carlos G","Isabel M","Javier R","Lucía T","Antonio H","María C","Pablo N","Ana F","Manuel G","Carmen L"]),
    ("Rome, Italy", ["Marco R","Giulia M","Luca B","Francesca T","Alessandro H","Valentina C","Matteo N","Chiara F","Lorenzo G","Sofia L"]),
    ("Amsterdam, Netherlands", ["Jan V","Anke B","Pieter R","Liesbeth M","Willem T","Marijke H","Hendrik C","Ingrid N","Kees F","Annelies G"]),
    ("Stockholm, Sweden", ["Erik J","Anna B","Lars M","Karin R","Johan T","Maria H","Anders C","Eva N","Sven F","Britta G"]),
    ("Vienna, Austria", ["Johann M","Maria B","Franz R","Theresa T","Klaus H","Elisabeth C","Karl N","Gertrude F","Werner G","Ingrid L"]),
    ("Zurich, Switzerland", ["Thomas M","Petra B","Daniel R","Monika T","Christian H","Susanne C","Stefan N","Brigitte F","Andreas G","Claudia L"]),
    ("Barcelona, Spain", ["Jordi M","Montserrat B","Xavier R","Núria T","Oriol H","Laia C","Marc N","Marta F","Pau G","Carme L"]),
    ("Warsaw, Poland", ["Krzysztof N","Agnieszka B","Piotr W","Małgorzata R","Andrzej T","Katarzyna H","Tadeusz C","Zofia F","Stanisław G","Halina L"]),
    ("Prague, Czech Republic", ["Tomáš N","Jana B","Petr R","Lucie T","Jakub H","Petra C","Martin F","Tereza G","Ondřej L","Zuzana M"]),
    ("Milan, Italy", ["Stefano R","Federica M","Roberto B","Eleonora T","Gianni H","Rossella C","Claudio N","Roberta F","Maurizio G","Patrizia L"]),
    ("Brussels, Belgium", ["Bruno D","Anne-Marie B","Pierre R","Nathalie T","Jacques H","Isabelle C","Luc N","Valérie F","Thierry G","Françoise L"]),
    ("Lisbon, Portugal", ["João S","Maria R","Pedro M","Ana T","Rui H","Sofia C","Nuno N","Inês F","Miguel G","Catarina L"]),
]
locations_east_asia = [
    ("Tokyo, Japan", ["Hiroshi T","Yuki S","Kenji N","Akiko M","Takeshi H","Yumi R","Daisuke K","Haruka B","Ryo F","Misa G","Shota L","Naomi C"]),
    ("Beijing, China", ["Wei Z","Fang L","Ming W","Ying C","Jian H","Xia T","Bo N","Mei F","Hao G","Lan B","Tao M","Jun S"]),
    ("Shanghai, China", ["Xiao L","Jun W","Hui Z","Ling C","Peng H","Qing T","Feng N","Rong F","Sheng G","Hua B"]),
    ("Seoul, South Korea", ["Min-jun K","Seo-yeon P","Ji-ho L","Ha-eun C","Dong-hyun W","Ye-jin S","Tae-yang K","Ji-yeon L","Seung-hyun P","Na-yeon C"]),
    ("Hong Kong", ["Ka-ming C","Mei-ling L","Wai-kin W","Pui-shan H","Chi-wai T","Lai-yee N","Kwok-fai B","Yuen-ling F","Man-kit G","Sau-ping M"]),
    ("Osaka, Japan", ["Satoshi Y","Yuki A","Naoki T","Emi K","Kenji S","Hitomi M","Ryo H","Kanako B","Yukio F","Nana G"]),
    ("Taipei, Taiwan", ["Chen-wei L","Mei-hua W","Jia-hong C","Li-ting H","Wei-ling T","Yi-jun N","Hao-yu F","Xiao-lin G","Ming-che B","Shu-fen M"]),
    ("Shenzhen, China", ["Zhi-yuan L","Xiao-mei W","Kai-feng C","Shan-shan H","Long-fei T","Jing-wen N","Peng-fei F","Yan-ling G","Xin-yu B","Hao-ran M"]),
    ("Singapore", ["Wei-liang T","Shu-fen L","Kian-huat C","Mei-xian W","Ah-kow H","Boon-keng N","Siew-hoon F","Hock-lim G","Peck-tin B","Swee-lan M"]),
    ("Busan, South Korea", ["Jin-soo K","Young-hee L","Sung-jin P","Min-ji C","Hyun-woo W","So-yeon S","Jae-won K","Eun-jung L","Byung-chul P","Hyo-jin C"]),
]
locations_latam = [
    ("São Paulo, Brazil", ["Lucas O","Mariana S","Gabriel R","Fernanda C","Rafael M","Isabela T","Thiago B","Camila N","Eduardo F","Beatriz G","Felipe H","Juliana L"]),
    ("Mexico City, Mexico", ["Alejandro R","Sofía M","Eduardo G","Valeria T","Roberto H","Daniela C","Fernando B","Natalia N","Andrés F","Paola G"]),
    ("Buenos Aires, Argentina", ["Martín L","Valentina B","Ignacio R","Florencia M","Nicolás T","Agustina H","Diego C","Luciana N","Tomás F","Julia G"]),
    ("Bogotá, Colombia", ["Carlos A","Ana M","Andrés R","Daniela T","Felipe H","Paula C","Juan B","Camila N","Sebastián F","Valentina G"]),
    ("Lima, Peru", ["José R","María M","Luis T","Ana H","Carlos C","Rosa N","Miguel F","Carmen G","Manuel B","Isabel L"]),
    ("Santiago, Chile", ["Rodrigo M","Francisca B","Ignacio R","Constanza T","Pablo H","Camila C","Felipe N","Sofía F","Andrés G","Javiera L"]),
    ("Guadalajara, Mexico", ["Jesús R","María M","José T","Guadalupe H","Juan C","Rosa N","Antonio F","Elena G","Francisco B","Concepción L"]),
    ("Monterrey, Mexico", ["Roberto G","Gabriela M","Ernesto R","Lorena T","Óscar H","Patricia C","Humberto N","Norma F","Arturo G","Yolanda B"]),
    ("Medellín, Colombia", ["Julio R","Luisa M","Camilo T","Diana H","Mauricio C","Natalia N","Esteban F","Alejandra G","Tomás B","Isabella L"]),
    ("Rio de Janeiro, Brazil", ["Pedro S","Luísa R","Bruno M","Gabriela T","André H","Larissa C","Gustavo N","Aline F","Leandro G","Priscila B"]),
]
locations_uk_can_aus = [
    ("Toronto, Canada", ["Ethan M","Emma B","Liam R","Ava T","Noah H","Olivia C","William N","Isabella F","Benjamin G","Sophia L","James K","Charlotte W"]),
    ("Sydney, Australia", ["Jack M","Chloe B","Lachlan R","Mia T","Harry H","Ella C","Tom N","Grace F","Angus G","Sophie L"]),
    ("Melbourne, Australia", ["Aiden M","Lily B","Lucas R","Zoe T","Oliver H","Chloe C","Noah N","Isabella F","Jack G","Amelia L"]),
    ("Vancouver, Canada", ["Ryan M","Samantha B","Tyler R","Jessica T","Brandon H","Kayla C","Jordan N","Ashley F","Taylor G","Brittany L"]),
    ("Montreal, Canada", ["Jean-François D","Marie-Ève B","Alexandre R","Isabelle T","Frédéric H","Catherine C","Nicolas N","Valérie F","Philippe G","Anne-Sophie L"]),
    ("Manchester, UK", ["Callum M","Niamh B","Declan R","Aoife T","Kieran H","Siobhan C","Cian N","Orla F","Oisín G","Caoimhe L"]),
    ("Edinburgh, UK", ["Alistair M","Fiona B","Hamish R","Catriona T","Angus H","Morag C","Ruaridh N","Eilidh F","Fergus G","Kirsty L"]),
    ("Brisbane, Australia", ["Mitch M","Steph B","Brock R","Tara T","Brad H","Kylie C","Shane N","Tracey F","Dean G","Leanne L"]),
    ("Calgary, Canada", ["Brett M","Shelby B","Cody R","Tiffany T","Cole H","Brittney C","Tanner N","Kaitlyn F","Travis G","Danica L"]),
    ("Birmingham, UK", ["Jaspal M","Preethi B","Gurpreet R","Mandeep T","Navdeep H","Ravinder C","Satinder N","Parmjit F","Harjinder G","Sukhjit L"]),
]
locations_row = [
    ("Mumbai, India", ["Rajesh S","Priya M","Amit B","Sunita R","Deepak T","Kavita H","Suresh C","Rekha N","Manoj F","Anita G","Vijay L","Nisha K"]),
    ("Delhi, India", ["Arun K","Meera S","Vikram B","Pooja R","Rohit T","Neha H","Sandeep C","Sonia N","Manish F","Anjali G"]),
    ("Nairobi, Kenya", ["David M","Grace W","John K","Faith N","Peter O","Mary A","James M","Ruth K","Samuel W","Esther N"]),
    ("Lagos, Nigeria", ["Emeka O","Chioma A","Chukwu N","Ngozi I","Bayo A","Funke O","Kemi A","Tunde B","Yemi C","Amaka D"]),
    ("Johannesburg, South Africa", ["Sipho M","Nomsa D","Thabo K","Zanele N","Lungelo B","Ntombizodwa C","Bongani F","Nompumelelo G","Siyanda H","Ayanda L"]),
    ("Dubai, UAE", ["Mohammed A","Fatima H","Ahmed K","Layla M","Omar N","Sara T","Khalid B","Reem C","Tariq F","Hessa G"]),
    ("Istanbul, Turkey", ["Mehmet Y","Ayşe K","Ali D","Fatma T","Mustafa H","Zeynep C","Ömer N","Emine F","İbrahim G","Hatice L"]),
    ("Cairo, Egypt", ["Ahmed M","Nour H","Mohamed A","Hana K","Mahmoud T","Dina B","Khaled C","Sara N","Karim F","Iman G"]),
    ("Bangalore, India", ["Kiran R","Shreya M","Arjun B","Divya T","Ravi H","Kavya C","Suresh N","Meghana F","Pratham G","Sowmya L"]),
    ("Jakarta, Indonesia", ["Budi S","Siti R","Eko M","Dewi T","Rizki H","Ayu C","Wahyu N","Putri F","Agus G","Ratna L"]),
    ("Manila, Philippines", ["Jose R","Maria S","Juan M","Ana T","Pedro H","Rosa C","Carlos N","Lourdes F","Antonio G","Carmen L"]),
    ("Kuala Lumpur, Malaysia", ["Ahmad R","Nurul S","Khairul M","Siti T","Farhan H","Azira C","Hafiz N","Nadirah F","Izzati G","Farah L"]),
    ("Cape Town, South Africa", ["Brendan M","Liezel B","Pieter R","Anelize T","Charl H","Riana C","Francois N","Marlize F","Johann G","Sunette L"]),
    ("Casablanca, Morocco", ["Youssef B","Fatima Z","Hassan M","Khadija R","Mohammed T","Amina H","Omar C","Zineb N","Rachid F","Hajar G"]),
    ("Tel Aviv, Israel", ["Yoav K","Noa M","Itai B","Maya R","Amir T","Tamar H","Avi C","Shira N","Ran F","Dana G"]),
    ("Accra, Ghana", ["Kwame A","Ama B","Kofi C","Abena D","Kojo E","Akua F","Kwesi G","Akosua H","Kweku I","Adwoa J"]),
    ("Karachi, Pakistan", ["Ali R","Fatima S","Omar M","Aisha T","Hassan H","Zainab C","Ibrahim N","Maryam F","Usman G","Hina L"]),
    ("Ho Chi Minh City, Vietnam", ["Nguyen V","Tran T","Le M","Pham H","Hoang C","Phan N","Vu F","Dang G","Bui L","Do B"]),
    ("Bangkok, Thailand", ["Somchai P","Malee W","Chai N","Nok T","Arthit H","Aom C","Supot F","Pim G","Nuttapong B","Nipa L"]),
    ("Riyadh, Saudi Arabia", ["Abdullah A","Noura M","Fahad K","Lama R","Sultan T","Hessa H","Walid C","Reem N","Saud F","Nadia G"]),
]

all_location_pools = [
    (locations_usa, 30),
    (locations_europe, 15),
    (locations_east_asia, 15),
    (locations_latam, 10),
    (locations_uk_can_aus, 10),
    (locations_row, 20),
]

def pick_location():
    r = random.random() * 100
    cumulative = 0
    for pool, pct in all_location_pools:
        cumulative += pct
        if r < cumulative:
            loc = random.choice(pool)
            city, names = loc[0], loc[1]
            return city, random.choice(names)
    loc = random.choice(locations_row)
    return loc[0], random.choice(loc[1])

# ── WANT TEMPLATES ───────────────────────────────────────────────────────────────
# Each template: (title, description, minPrice, maxPrice)

WANTS = {
"electronics": [
    ("Apple MacBook Pro 16\" M3 Max 128GB RAM Space Black", "Looking for a MacBook Pro 16-inch with M3 Max chip, 128GB unified memory, 2TB SSD. Must be Space Black, in excellent condition, under 6 months old. Original box preferred.", 3000, 4500),
    ("Dell XPS 15 9530 i7-13700H 32GB RAM 1TB SSD", "Need a Dell XPS 15 9530 configured with Intel i7-13700H processor, 32GB DDR5, 1TB NVMe SSD, OLED display. Minor scratches OK, no dead pixels.", 1400, 2200),
    ("Sony A7R V Full-Frame Mirrorless Camera Body Only", "Searching for a Sony Alpha A7R V mirrorless camera body. Must have under 5,000 shutter actuations and all menus functioning. No sensor dust.", 2800, 3800),
    ("Nikon Z8 Mirrorless Camera with FTZ II Adapter", "Looking for Nikon Z8 body with FTZ II mount adapter. Prefer under 10,000 shots. Must include original battery and charger. No drops or water damage.", 3200, 4200),
    ("Samsung 65\" QN90C Neo QLED 4K Smart TV", "Need Samsung 65-inch QN90C Neo QLED. Must be fully functional with all original remotes and stand. No dead pixels, screen burn, or panel damage.", 1000, 1600),
    ("Sony WH-1000XM5 Wireless Headphones Black", "Seeking Sony WH-1000XM5 noise-cancelling headphones. Must include original carrying case, cables, and be fully functional with ANC working.", 200, 380),
    ("Apple iPhone 16 Pro Max 512GB Desert Titanium", "Looking for iPhone 16 Pro Max 512GB in Desert Titanium. Unlocked, battery health above 90%, no cracks on screen or back glass.", 900, 1300),
    ("ASUS ROG Strix G16 RTX 4090 i9 Gaming Laptop", "Need ASUS ROG Strix G16 with RTX 4090, i9-13980HX, 64GB RAM, 2TB SSD. Must come with original charger. GPU fan must be silent.", 2500, 3500),
    ("DJI Mavic 3 Pro Cine Drone with RC Pro Controller", "Seeking DJI Mavic 3 Pro Cine combo with RC Pro controller. Must include 3 batteries and charging hub. Under 5 hours flight time. No prop strikes.", 2200, 3000),
    ("Panasonic GH6 Mirrorless Camera Body", "Looking for Panasonic Lumix GH6. Must have all ports functional including HDMI and 3.5mm. Shutter count under 15,000 preferred.", 900, 1400),
    ("Apple iPad Pro 13\" M4 1TB WiFi + Cellular Space Black", "Seeking iPad Pro 13-inch M4 with 1TB storage, WiFi + Cellular, Space Black. Must include Apple Pencil Pro and Magic Keyboard Folio.", 1800, 2800),
    ("Sony PlayStation 5 Slim Disc Edition White", "Need PS5 Slim disc edition. Must include original DualSense controller, HDMI cable, and all accessories. No controller drift issues.", 400, 600),
    ("Canon EOS R5 C Cinema Camera Body", "Looking for Canon EOS R5 C cinema camera body. Must include dual cooling fan. All video modes must work including 8K RAW. Under 200 hours.", 3000, 4500),
    ("Bose QuietComfort Ultra Earbuds Black", "Seeking Bose QC Ultra Earbuds in Black. Must include all ear tip sizes, charging case, and cable. ANC and Spatial Audio must work properly.", 200, 320),
    ("LG C3 65\" OLED 4K TV", "Need LG C3 65-inch OLED TV. Must have no pixel damage, burn-in, or flickering. Magic Remote must be included. Prefer under 2 years old.", 1200, 2000),
    ("Apple Watch Ultra 2 Titanium 49mm GPS+Cellular", "Looking for Apple Watch Ultra 2 in Titanium. Must include original band, charger, and box. Battery health above 90%. No scratches on display.", 700, 1000),
    ("Fujifilm X-T5 Mirrorless Camera Body", "Seeking Fujifilm X-T5 body only. Must have all dials functional and sensor clean. Under 8,000 shutter count preferred.", 1400, 2000),
    ("Nintendo Switch OLED White + 10 Games Bundle", "Need Nintendo Switch OLED White edition with at least 10 games. Must include dock, joycons, and HDMI cable. No joycon drift.", 400, 700),
    ("Garmin Fenix 7X Sapphire Solar Titanium GPS Watch", "Looking for Garmin Fenix 7X Sapphire Solar. Must have sapphire glass with no scratches. All sensors including GPS must function. Battery health good.", 600, 850),
    ("Samsung Galaxy S25 Ultra 512GB Titanium Phantom Black", "Seeking Samsung Galaxy S25 Ultra 512GB. Factory unlocked. Must include S Pen. No scratches on display or back. Battery health above 90%.", 1000, 1300),
    ("GoPro Hero 13 Black + Accessories Bundle", "Need GoPro Hero 13 Black with at least 3 batteries, charging grip, and extra mounts. Must record 5.3K video without overheating.", 350, 550),
    ("Rode NT1 5th Gen Studio Condenser Microphone", "Seeking Rode NT1 5th Generation condenser microphone with shock mount and dust cover. Must be USB-C and XLR. No self-noise issues.", 220, 320),
    ("Elgato Stream Deck XL 32-Key Streaming Controller", "Looking for Elgato Stream Deck XL. All 32 buttons must illuminate and register. Must include USB cable and original box.", 150, 250),
    ("Kindle Scribe 10.2\" with Premium Pen", "Need Amazon Kindle Scribe 32GB with Premium Pen. Screen must be pristine with no scratches. Writing feature must work without lag.", 200, 350),
    ("Razer Blade 15 RTX 4080 i9 Mercury White", "Seeking Razer Blade 15 with RTX 4080, i9-13950HX, 32GB RAM, 1TB SSD. Mercury White preferred. No keyboard backlight issues.", 2200, 3200),
    ("Meta Quest 3 512GB VR Headset + Elite Strap", "Looking for Meta Quest 3 512GB with Elite Strap. Must include both controllers and all lenses scratch-free. All tracking must function.", 550, 750),
    ("Sigma 35mm f/1.4 DG DN Art Lens Sony E-mount", "Seeking Sigma 35mm f/1.4 DG DN Art for Sony E-mount. Must have no fungus, haze, or scratches on elements. All autofocus speeds must work.", 600, 850),
    ("Anker 778 Thunderbolt 4 Docking Station 12-in-1", "Need Anker 778 Thunderbolt 4 docking station. All ports must be functional including dual Thunderbolt 4, HDMI 2.1, and Ethernet.", 200, 320),
    ("Sony ZV-E10 II APS-C Mirrorless Vlog Camera", "Looking for Sony ZV-E10 II vlog camera. Must include kit lens 16-50mm, extra battery, and SD card. No hot-shoe issues.", 700, 1000),
    ("Logitech MX Keys S Plus Keyboard + MX Master 3S Mouse", "Seeking Logitech MX Keys S Plus keyboard with palm rest and MX Master 3S mouse bundle. Must both be fully charged and functional.", 160, 240),
    ("Leica Q3 Full-Frame Compact Camera", "Looking for Leica Q3 compact camera. Must include original lens cap, charger, and box. Under 3,000 shutter count. No scratches on Summilux lens.", 4000, 6000),
    ("MSI Titan GT77 HX RTX 4090 i9 17.3\" Gaming Laptop", "Seeking MSI Titan GT77 HX with RTX 4090, i9-13980HX, 128GB RAM, 4TB RAID. All keys must illuminate. Thermal paste fresh.", 3500, 5000),
    ("Jabra Evolve2 85 Wireless Headset UC Version", "Need Jabra Evolve2 85 with UC software. Must include link dongle, charging stand, and carry bag. All mic modes must work.", 350, 520),
    ("ASUS ProArt PA32UCR 32\" 4K HDR Mini-LED Monitor", "Looking for ASUS ProArt PA32UCR 32-inch 4K HDR monitor. Must have calibration report. No dead pixels or backlight bleed.", 2000, 3000),
    ("Blackmagic Pocket Cinema Camera 6K G2", "Seeking BMPCC 6K G2. Must include two batteries, V-mount plate optional. All recording formats must work including BRAW 6K.", 1200, 1900),
    ("Insta360 X4 360° Action Camera + Invisible Selfie Stick", "Looking for Insta360 X4 with invisible selfie stick and extra lens guards. Must record 8K 360 without overheating. All stitching software unlocked.", 350, 550),
    ("Apple Mac Mini M4 Pro 24GB 512GB Space Gray", "Need Apple Mac Mini M4 Pro with 24GB RAM and 512GB SSD. Must include original power cable. All Thunderbolt 5 ports functional.", 1200, 1700),
    ("Wacom Cintiq Pro 27\" Creative Pen Display", "Seeking Wacom Cintiq Pro 27. Must include Pro Pen 3, stand, and all cables. No dead pixels. ExpressKey Remote preferred.", 2500, 3500),
    ("Sony A1 Full-Frame Mirrorless 50.1MP Camera Body", "Looking for Sony Alpha 1 body. Shutter under 20,000 counts. Must include original battery, charger, and body cap. Sensor must be clean.", 5000, 7500),
    ("Herman Miller Monitor Arm Single Post", "Need Herman Miller Ollin single monitor arm. Must support up to 32-inch monitor. All adjustments must lock firmly. No stripped bolts.", 150, 250),
    ("Thermaltake Core P8 TG Mid-Tower ATX Case", "Seeking Thermaltake Core P8 Tempered Glass case with vertical GPU bracket. Must include all original accessories and screws.", 180, 280),
],
"furniture": [
    ("Herman Miller Aeron Chair Size B Graphite", "Looking for Herman Miller Aeron in size B, Graphite frame. Must have all lumbar adjustments functional. PostureFit SL preferred. Under 5 years old.", 700, 1200),
    ("Standing Desk — UPLIFT V2 Commercial 72\"x30\"", "Seeking UPLIFT V2 Commercial standing desk, 72\" wide, 30\" deep, with dual motor. Must include memory keypad and be fully functional. Laminate or butcher block top.", 800, 1400),
    ("IKEA KALLAX 5x5 Shelf Unit White", "Need IKEA KALLAX 5x5 shelf unit in white. Must be fully assembled and stable. No shelf damage, warping, or missing pegs. Will disassemble for pickup.", 80, 160),
    ("West Elm Mid-Century Modern Sofa 77\" Velvet", "Seeking West Elm Mid-Century 77-inch sofa in velvet. Prefer Ink Blue or Smoked finish. Must have no stains, pet hair, or damage to legs.", 700, 1200),
    ("Crate & Barrel Lounge II 2-Piece Sectional Sofa", "Looking for Crate & Barrel Lounge II chaise sectional. Must be in excellent condition. Prefer Performance Fabric in grey or blue.", 1500, 2500),
    ("IKEA HEMNES Daybed Frame White", "Need IKEA HEMNES daybed frame in white. Must include all slats and drawers. No damage to wood or paint chips. Mattresses not needed.", 200, 400),
    ("Pottery Barn Benchwright Dining Table 86\" Rustic Brown", "Seeking Pottery Barn Benchwright extending dining table, 86\", rustic brown finish. Must seat 8+ when extended. No warping or water damage.", 800, 1500),
    ("Knoll Saarinen Tulip Round Dining Table 48\"", "Looking for authentic Knoll Saarinen Tulip table, 48-inch top. Must have Knoll label. Marble or laminate top. Base must be chip-free.", 1500, 3000),
    ("Steelcase Leap V2 Chair Black Fabric", "Need Steelcase Leap V2 task chair in black fabric. All adjustments must work smoothly. No torn upholstery or cracked plastic components.", 500, 900),
    ("Floyd Platform Bed Frame Queen Maple", "Seeking Floyd platform bed frame in Queen size, Maple color. Must include all legs and hardware. No scratches on steel frame.", 400, 700),
    ("Restoration Hardware Cloud Sofa 130\" Depth Modular", "Looking for RH Cloud sectional pieces. Must be in Perennials Fabric or similar performance fabric. Individual sections or full set. No fading.", 2000, 5000),
    ("IKEA ALEX Desk Drawer Unit White 36\"", "Need IKEA ALEX 9-drawer desk unit in white. All drawers must open smoothly. No water damage to particle board.", 80, 140),
    ("Kartell Louis Ghost Armchairs Set of 4 Clear", "Seeking 4x Kartell Louis Ghost armchairs in Crystal Clear. Must be stacked-free set with no cracks or yellowing.", 500, 900),
    ("Eames Lounge Chair + Ottoman — Original Herman Miller", "Looking for authentic Herman Miller Eames Lounge Chair and Ottoman. Medium walnut shell. Black leather. Must have HM label. No tears.", 3000, 6000),
    ("Vitra Panton Chair Set of 6 Red", "Seeking 6x Vitra Panton Classic chairs in Red. Must all be matching year/color. No cracks in polypropylene.", 600, 1200),
    ("Arhaus Breckenridge Sectional L-Shape", "Looking for Arhaus Breckenridge sectional. Must be in excellent condition. Power recliner function must work. Prefer Performance Velvet fabric.", 2000, 4000),
    ("IKEA PAX Wardrobe 250x236cm White", "Need IKEA PAX wardrobe system, 250cm wide, 236cm tall. Must include doors (prefer Hasvik sliding) and internal fittings.", 400, 700),
    ("Tempur-Pedic ProAdapt Medium Hybrid Queen Mattress", "Seeking Tempur-Pedic ProAdapt Medium Hybrid Queen mattress. Must be under 3 years old and come from smoke-free home. No sagging.", 1500, 2500),
    ("Article Sven Sofa 88\" Charme Tan Leather", "Looking for Article Sven 88-inch sofa in Charme Tan leather. Must have original legs. No scratches, stains, or peeling leather.", 800, 1500),
    ("Mid-Century Modern Credenza 70\" Walnut Hairpin Legs", "Need mid-century credenza approximately 70 inches wide in walnut veneer with hairpin or tapered legs. Sliding doors preferred. No missing hardware.", 400, 900),
],
"vehicles": [
    ("2019 Toyota Land Cruiser 200 Series VX 4x4", "Seeking 2019 Toyota Land Cruiser 200 Series VX. Must have under 80,000 km. Full service history. No accidents. Prefer White Pearl or Graphite.", 55000, 75000),
    ("2015–2018 Porsche 911 Carrera S Manual RWD", "Looking for Porsche 911 991.2 Carrera S with PDK or manual gearbox. Under 50,000 miles. Full Porsche service history required. CPO preferred.", 80000, 120000),
    ("2022 Tesla Model 3 Long Range AWD Blue", "Need a 2022 Tesla Model 3 Long Range AWD in Deep Blue Metallic. Under 30,000 miles, no accidents, enhanced autopilot preferred.", 28000, 38000),
    ("1967–1969 Ford Mustang Fastback Any Condition", "Seeking a 1967, 1968, or 1969 Ford Mustang Fastback. Running condition required. Rust OK if frame solid. GT trim or V8 preferred.", 30000, 80000),
    ("Vespa GTS 300 Super Tech 2021–2023", "Looking for a Vespa GTS 300 Super Tech scooter, 2021 or newer. Under 8,000 km. Must have ABS and traction control. No crash damage.", 6000, 9000),
    ("2018–2021 Jeep Wrangler Unlimited Rubicon 4-Door", "Seeking Jeep Wrangler Unlimited Rubicon 4-door. Under 60,000 miles. Lifted suspension and steel bumpers a plus. No frame rust or flood damage.", 35000, 55000),
    ("2020 BMW M3 Competition Sedan Isle of Man Green", "Looking for BMW M3 Competition sedan. Isle of Man Green or other manual color preferred. Under 25,000 miles. All options including heated seats.", 65000, 85000),
    ("Kawasaki Ninja ZX-10R 2022–2023 Low Mileage", "Need Kawasaki Ninja ZX-10R, 2022 or newer. Under 5,000 km. Must include original exhaust. No track use or drops. Title clean.", 12000, 17000),
    ("1985–1990 Land Rover Defender 110 Turbo Diesel", "Seeking original Land Rover Defender 110 from 1985–1990 with TD5 or Tdi engine. UK or European spec. Right-hand drive preferred.", 25000, 60000),
    ("2023 Toyota GR86 Manual 6-Speed", "Looking for 2023 Toyota GR86 with 6-speed manual. Under 15,000 miles. Track or sport pack preferred. No accident history. Any color.", 28000, 38000),
    ("2021 Harley-Davidson Sportster S RH1250S", "Seeking Harley-Davidson Sportster S. Under 10,000 miles. Must have all original parts. No crash damage. Prefer Vivid Black or Stone Washed White Pearl.", 12000, 18000),
    ("1978 Volkswagen T2 Camper Van Restored", "Looking for a restored 1978 VW T2 Bay Window camper. Must have pop-top roof and functioning kitchen. Engine must run well. Any color considered.", 25000, 55000),
    ("2022 Rivian R1T Adventure Package Electric Truck", "Seeking Rivian R1T with Adventure Package. Under 30,000 miles. All-electric, Level 2 charging included. Camp Kitchen optional but preferred.", 55000, 75000),
    ("2019–2022 Ducati Panigale V4 S", "Looking for Ducati Panigale V4 S, 2019–2022. Under 10,000 km. Original Öhlins suspension must be intact. No track crashes.", 20000, 30000),
    ("Trek Domane SL 7 Disc Road Bike 56cm Carbon", "Need Trek Domane SL 7 Disc in 56cm frame. Must include Shimano Ultegra Di2 groupset, carbon wheels. Under 3,000 km. No carbon damage.", 4000, 6000),
],
"clothing": [
    ("Nike Air Jordan 1 Retro High OG 'Chicago' 2015 Size 10.5", "Seeking Nike Air Jordan 1 Retro High OG Chicago from 2015 re-release in size 10.5 US. Must be at least 95% DS condition with original box.", 400, 800),
    ("Supreme Box Logo Hoodie FW20 Black Size L", "Looking for Supreme Box Logo Hoodie Fall/Winter 2020 in black, size L. Must be 100% authentic with original tags. Worn at most once.", 400, 700),
    ("Levi's 501 Original Jeans 1980s USA-Made 34x32", "Seeking vintage Levi's 501 jeans made in USA, 1980s era. Prefer 34x32 or 32x32 waist/length. Orange tab, red selvedge preferred.", 80, 200),
    ("Barbour Beaufort Waxed Jacket Size L Olive", "Looking for Barbour Beaufort waxed cotton jacket in Olive, size L. Must be in good waxed condition, no tears in fabric. Corduroy lining intact.", 150, 300),
    ("Adidas Yeezy Boost 350 V2 Zebra Size 9 US", "Need Adidas Yeezy Boost 350 V2 Zebra in US size 9. Authentic only, no fakes. Original receipt or box preferred. Worn few times max.", 300, 600),
    ("Patagonia Black Hole Duffel 55L Black", "Seeking Patagonia Black Hole Duffel 55L in Black. Must have all zippers functioning and no holes. Shoulder straps must be intact.", 100, 180),
    ("Vintage Levi's Sherpa Trucker Jacket 1990s M", "Looking for vintage Levi's Trucker jacket with sherpa lining, 1990s era, size M. Must be made in USA. Minimal fading accepted.", 60, 150),
    ("Carhartt WIP Detroit Jacket Stone Washed Hamilton Brown M", "Seeking Carhartt WIP Detroit jacket in Hamilton Brown stone wash, size M. Must have all snap buttons functioning. Minimal wear.", 80, 160),
    ("New Balance 990v3 Made in USA Grey Size 11", "Need New Balance 990v3 in grey, US size 11. Must be authentic Made in USA pair. Minimal wear, original laces. Box preferred.", 150, 280),
    ("Arc'teryx Beta AR Jacket Men's S Black", "Looking for Arc'teryx Beta AR Gore-Tex jacket in black, men's size S. Must have all seams taped and no delamination. Gore-Tex still functional.", 400, 700),
    ("Polo Ralph Lauren Bear Knit Sweater 1990s Vintage L", "Seeking vintage Polo Ralph Lauren bear knit sweater from the 1990s, size L. Must have classic bear on front with clear logo. No holes or pilling.", 200, 450),
    ("Yohji Yamamoto Y-3 Track Pants Black L", "Looking for Y-3 by Yohji Yamamoto track pants in black, size L. Must have three stripes detail and YY logo. Minimal wear only.", 150, 300),
    ("Vintage Champion Reverse Weave Sweatshirt XL 1990s", "Need vintage Champion reverse weave crewneck from 1990s, XL. Classic C logo. Made in USA or Honduras. Minimal fading or cracking.", 60, 150),
],
"services": [
    ("Certified Plumber for Bathroom Renovation — 2 Days", "Looking for a licensed plumber to handle a full bathroom renovation including moving pipes, installing new fixtures, and tiling. Need 2 days of work in February.", 400, 900),
    ("Professional Deep Cleaning — 3-Bedroom Apartment", "Seeking a professional deep cleaning service for a 3-bedroom, 2-bath apartment. Must include oven, fridge, and inside-window cleaning. Same-day availability preferred.", 150, 350),
    ("Weekly Mandarin Chinese Tutor — Advanced Level", "Looking for a native Mandarin speaker to provide weekly 1-hour tutoring sessions for HSK 5 preparation. Business Mandarin preferred. Online or in-person.", 30, 80),
    ("Personal Chef for Dinner Party — 8 Guests", "Seeking a personal chef to prepare a 3-course dinner for 8 guests in my home. International cuisine preferred. Must be licensed with food handler certificate.", 300, 700),
    ("Wedding Photographer for 6-Hour Coverage", "Looking for a professional wedding photographer for a 6-hour reception. Must have a portfolio of at least 5 previous weddings. RAW files and edited gallery required.", 1500, 3500),
    ("Spanish–English Certified Legal Translator", "Seeking a certified Spanish-English translator for legal documents. Must have ATA certification or equivalent. Immigration papers, approximately 20 pages.", 150, 350),
    ("Experienced Dog Walker — Daily 60-Min Walks", "Looking for a reliable dog walker for two medium-sized dogs (Labrador mix, Beagle). Daily 60-minute walks, Monday–Friday. Must be insured and pet first aid certified.", 20, 40),
    ("HVAC Technician — Central AC Service + Recharge", "Need a certified HVAC technician to service a 4-ton central air conditioner. Must check refrigerant levels, clean coils, and test all zones. Same-day preferred.", 150, 350),
    ("SAT Math Tutor — 800 Target Score", "Seeking an experienced SAT math tutor targeting an 800 score. Must have verifiable track record of students achieving 780+. Flexible online scheduling.", 50, 120),
    ("Electrician for Home EV Charger Installation", "Need a licensed electrician to install a Level 2 EV charger (240V, 50A circuit) in a detached garage. Must pull permit and provide inspection certificate.", 400, 900),
    ("Moving Company — 2BR Apartment Local Move", "Looking for a professional moving company for a 2-bedroom apartment move within the same city. Need 3 movers and a truck for half a day. Insurance required.", 300, 700),
    ("Professional Headshot Photographer — 1 Hour Studio", "Seeking a photographer for 1-hour professional headshot session in a studio or outdoor setting. Must provide at least 10 edited high-res images.", 150, 350),
    ("Airbnb/Short-Term Rental Cleaning Service", "Looking for a reliable cleaning team for short-term rental turnover cleaning. 2-bedroom condo, must be available on short notice. Provide own supplies.", 80, 180),
    ("Music Lessons — Piano — Beginner Adult", "Seeking a piano teacher for weekly 1-hour beginner lessons for an adult. Classical foundation preferred. Must come to my home or offer online sessions.", 40, 80),
    ("IT Support — Home Network Setup + Security", "Need a qualified IT technician to set up a secure home network with VLAN separation, mesh WiFi, and firewall configuration. 3-bedroom home.", 150, 400),
    ("House Painter — Interior 3-Bedroom Home", "Looking for a professional interior house painter to paint 3 bedrooms, 2 living areas, and hallways. Must provide own materials. Quote required.", 1000, 3000),
    ("Bookkeeping Service — Small Business Monthly", "Seeking an experienced bookkeeper for a small retail business. Monthly reconciliation, P&L, and tax prep support. Must be familiar with QuickBooks Online.", 200, 500),
    ("Drone Photography — Real Estate Aerial Shots", "Need a licensed Part 107 drone pilot for residential real estate aerial photography. Must deliver 20+ edited photos and short video within 48 hours.", 200, 450),
    ("Language Tutor — Japanese Conversational JLPT N2", "Looking for a native Japanese speaker for weekly conversational practice targeting JLPT N2. Online sessions via Zoom. 1.5 hours per week.", 30, 70),
    ("Notary Public — Mobile Same Day", "Seeking a mobile notary public available same day for loan signing documents. Must be commissioned and E&O insured. Will travel within 20 miles.", 50, 150),
    ("Pet Grooming — Full Groom Standard Poodle", "Need full grooming service for a standard poodle (continental clip preferred). Must include bath, blow dry, nails, and ear cleaning. Mobile or salon.", 80, 180),
    ("Interior Designer — Living Room Redesign Consultation", "Seeking an interior designer for a living room redesign consultation. 400 sq ft space. Budget of $5k for furniture and decor. Must provide 3D renderings.", 200, 600),
    ("Tax Preparation — Self-Employed Schedule C + Investments", "Looking for a CPA to prepare taxes for self-employed individual with Schedule C income, investment accounts, and rental property. Must be enrolled agent or CPA.", 300, 700),
    ("Landscaping — Front Yard Redesign + Planting", "Need a professional landscaper to redesign a 1,200 sq ft front yard, including native plantings, drip irrigation, and ground cover. Estimate required.", 2000, 6000),
    ("Car Detailing — Full Interior + Exterior Ceramic Coat", "Seeking a professional auto detailer for full interior deep clean and exterior ceramic coating on a mid-size SUV. Must be certified in ceramic coating application.", 300, 700),
    ("Coding Bootcamp Mentor — Python & Machine Learning", "Looking for a Python/ML mentor for 1-on-1 sessions, 2 hours/week. Must have industry experience building ML models. Preferably in fintech or biotech.", 60, 150),
    ("Alterations Tailor — Wedding Dress", "Need a skilled tailor to take in a wedding dress 2 sizes and add bustle. Must have portfolio of bridal work. Deliver 3 weeks before wedding.", 200, 500),
    ("Part-Time Virtual Assistant — 20 Hours/Week", "Looking for a bilingual (English/Spanish) virtual assistant for 20 hours per week. Administrative tasks: scheduling, email, research. Must be reliable and detail-oriented.", 15, 30),
    ("Personal Trainer — Home Gym 3x/Week", "Seeking a certified personal trainer for 3 home gym sessions per week. Must have NASM or ACE certification. Focus on strength training and mobility.", 50, 120),
    ("Real Estate Photography — 5-Bedroom Home Listing", "Need a professional real estate photographer for a 5-bedroom, 3-bath home listing. Must provide HDR photos, twilight shots, and floor plan. 24-hour turnaround.", 250, 500),
],
"education": [
    ("Official GMAT Focus Edition Prep Material Set 2024", "Looking for GMAT Focus Edition official prep materials including OG, Quant Review, and Verbal Review. Must be 2024 edition. No highlighting beyond first chapter.", 80, 180),
    ("TOEFL iBT Complete Self-Study Package", "Seeking complete TOEFL iBT prep package including ETS official guide, audio CDs or USB, and practice test access codes. Must be active.", 60, 140),
    ("Cambridge IELTS 13-19 Academic Complete Set", "Need Cambridge IELTS Academic practice books 13 through 19, complete set. Must include all answer keys. Minimal writing in books.", 60, 130),
    ("Weekly Online Spanish Tutor — Conversational B2", "Seeking a native Spanish speaker for weekly 1-hour conversational practice at B2–C1 level. Must be patient and structured. Latin American accent preferred.", 25, 60),
    ("CFA Level 2 Schweser Study Package 2024", "Looking for CFA Level 2 Kaplan Schweser study package 2024. Must include all 5 volumes, practice exams, and flashcards. Minimal highlighting.", 150, 280),
    ("Python for Data Science Online Course Access — Udemy", "Seeking a transferable Udemy course access for Python for Data Science, Machine Learning, and Deep Learning. Must be lifetime access and complete.", 15, 50),
    ("SAT Official Study Guide 10 Practice Tests 2024", "Need College Board SAT official practice book with 10 full-length tests. 2024 edition. No completed practice tests. Answer key included.", 20, 45),
    ("LSAT Prep Course — In-Person or Online with Tutor", "Looking for an LSAT prep course (Kaplan, Princeton Review, or similar) or private tutor. Target score 175+. Must have diagnostic assessment included.", 500, 1500),
    ("Rosetta Stone Lifetime Access — Japanese", "Seeking Rosetta Stone Lifetime access code for Japanese. Must be transferable and include all levels. Unused or barely used.", 80, 180),
    ("CompTIA A+ Study Kit — Mike Meyers 2024 Edition", "Need CompTIA A+ complete study kit including Mike Meyers textbook, practice test software, and exam voucher. 2024 Core 1 and Core 2.", 150, 280),
    ("Medical School Anatomy Flash Cards — Netter's Set", "Looking for Netter's Anatomy Flash Cards 5th edition set. Must include all 4 boxes. Minimal writing. Perfect for USMLE Step 1 prep.", 60, 120),
    ("GRE Prep Complete Set — Manhattan Prep 6 Books", "Seeking Manhattan Prep GRE complete set (6 books) plus Verbal Reasoning and Quant practice set. 2024 editions. No excessive annotation.", 80, 160),
    ("Online Coding Bootcamp Enrollment — Full Stack JS", "Looking to purchase a seat/access code for a full-stack JavaScript bootcamp (App Academy, Flatiron, General Assembly, or similar). Career services included.", 1000, 5000),
    ("Piano Lesson Curriculum Books — Royal Conservatory Level 3–8", "Seeking Royal Conservatory of Music piano lesson books, levels 3–8. Must include technique and sight-reading books for each level. Minimal pencil marks.", 50, 120),
    ("Online Japanese Language Course — JLPT N3 Level", "Need access to a structured JLPT N3 Japanese course with video lectures and practice tests. JapanesePod101 lifetime or similar platform.", 50, 150),
],
"auto-parts": [
    ("NOS 1967 Ford Mustang Steering Wheel with Horn Ring", "Looking for a New Old Stock or excellent original 1967 Ford Mustang steering wheel with intact horn ring. Woodgrain or black deluxe trim preferred. No cracks.", 300, 800),
    ("BMW E46 M3 CSL Carbon Fiber Roof Panel OEM", "Seeking original BMW E46 M3 CSL carbon fiber roof panel. Must be crack-free with correct CSL weave. No repairs. OEM BMW part.", 2000, 4000),
    ("1970 Chevelle SS 454 Hood with Cowl Induction Scoop", "Looking for original 1970 Chevelle SS454 hood with functioning cowl induction flap. Rust-free or minimal surface rust. Original paint OK.", 800, 2500),
    ("Porsche 993 Carrera RS Front Bumper Cover OEM", "Seeking Porsche 993 Carrera RS front bumper in original condition. Must be OEM Porsche part. No cracks, repairs, or resprays.", 1500, 4000),
    ("Toyota Supra MK4 2JZ-GTE Engine Block Bare", "Need a 1993–1998 Toyota Supra MK4 2JZ-GTE bare engine block. Must be straight, no cracks. Core or rebuildable condition. Matching VIN not required.", 2000, 5000),
    ("Alfa Romeo Spider 1966–1969 Duetto Tail Fin Panel Right", "Seeking right rear tail fin panel for 1966–1969 Alfa Romeo Duetto Spider. Rust-free original steel preferred. Replacement or NOS acceptable.", 400, 1200),
    ("Mercedes W123 300D Diesel Injection Pump Bosch", "Looking for Bosch mechanical injection pump for Mercedes W123 300D (1977–1985). Must be working or rebuildable. Part number 0460405009 or equivalent.", 300, 900),
    ("Original 1969 Camaro ZL1 Hemi Hood", "Seeking the distinctive high-rise hood from a 1969 Camaro ZL1 or equivalent RPO L72. Rust-free steel. Provenance documentation a strong plus.", 1000, 3500),
    ("VW Beetle 1965–1967 Running Board Set Original", "Need original running boards for 1965–1967 VW Beetle. Must be a matching pair. Rust-free or sandable condition. Chrome trim preferred.", 150, 400),
    ("Ford GT40 Replica Fiberglass Body Kit Complete", "Looking for a complete fiberglass body kit for a GT40 replica build. Must include front and rear clam shells, doors, and side sills. CAV, ERA, or similar.", 5000, 15000),
    ("Datsun 240Z S30 Front Fenders Pair Rust-Free", "Seeking a pair of rust-free front fenders for a Datsun 240Z (1969–1973). Steel OEM preferred. No major dents or repairs.", 300, 900),
    ("Ferrari 308 GTS Targa Top Panel Original", "Looking for original targa top panel for Ferrari 308 GTS. Must fit 1977–1985 models. No cracks in fiberglass. Paint condition secondary.", 500, 1800),
    ("Jaguar E-Type Series 1 Bonnet — Long Nose", "Seeking original long-nose bonnet/hood for Jaguar E-Type Series 1 (1961–1968). Rust-free or minor surface rust only. Right or left-hand drive.", 2000, 6000),
    ("NOS Holley 4150 Double Pumper 750CFM Carburetor", "Looking for NOS or excellent used Holley 4150 750CFM double pumper carburetor. Preferably in original box with jets. No leaks or cracks.", 400, 1000),
    ("1932 Ford Model B Flathead V8 Complete Engine", "Seeking a 1932 Ford Model B 221ci Flathead V8 complete engine, turning or rebuildable. All 8 cylinders present. Minimal parts missing.", 2000, 6000),
    ("BBS RS 17x9 ET15 4x100 Set of 4 Refurbished", "Need a set of 4 BBS RS wheels, 17x9 ET15, 4x100 bolt pattern. Must be crack-free and balanced. Powdercoat or polished finish.", 600, 1500),
    ("Original Lamborghini Countach LP400 Wheel 15\" Set", "Searching for original Lamborghini Countach LP400 Campagnolo alloy wheels, 15 inch. Must be matching set of 4. No cracks. Provenance documents a plus.", 3000, 8000),
    ("Mazda RX-7 FD3S Veilside Fortune Body Kit", "Seeking Veilside Fortune body kit for Mazda RX-7 FD3S. Must include front bumper, rear bumper, wide-body fenders, and side skirts. FRP material.", 2000, 5000),
    ("Ford Model A 1928–1931 Wooden Spoke Wheels Set 4", "Looking for a set of 4 wooden spoke wheels for 1928–1931 Ford Model A. 21-inch diameter. Must be straight and structurally sound.", 400, 1200),
    ("Vintage SU Carburetor Set for Triumph TR6 1969–1976", "Seeking a matching pair of SU HS6 carburetors for a Triumph TR6. Must be rebuildable with all components present. Rebuild kits OK.", 150, 400),
    ("1969 Dodge Charger R/T 440 Air Cleaner Assembly", "Looking for original 1969 Dodge Charger R/T 440 Six Pack or Magnum air cleaner assembly. Must include all components. No cracks.", 300, 1000),
    ("Brembo GT 6-Piston Caliper Kit Front Porsche 911 991", "Seeking Brembo GT front 6-piston caliper upgrade kit for Porsche 911 991 series. Must include calipers, brackets, and rotors. Red finish preferred.", 2000, 4500),
    ("Turbo Kit — Garrett GT35R for RB26DETT Engine", "Need a complete turbo upgrade kit including Garrett GT35R turbocharger, manifold, and downpipe for Nissan Skyline GT-R RB26DETT. 600+ HP potential.", 1500, 3500),
    ("Vintage Michelin X 600-15 Tire Set NOS", "Seeking set of 4 NOS Michelin X crossply 600-15 tires for a classic French car restoration. Must be unused or very old stock with no dry rot.", 300, 800),
    ("Willys Jeep MB 1942–1945 Transfer Case NP Dana", "Looking for a transfer case for a 1942–1945 Willys MB military Jeep. Must be original Dana or early Spicer unit. Complete or rebuildable.", 400, 1200),
    ("Edelbrock Performer 351W Intake Manifold NOS", "Seeking NOS or excellent used Edelbrock Performer single-plane intake manifold for Ford 351 Windsor. Part #2750 or #2765. Original box a plus.", 150, 400),
    ("Ferrari Testarossa Doorsill Rocker Panel Set OEM", "Looking for original Ferrari Testarossa (1984–1991) door sill / rocker panel set. Must be rust-free. OEM straked design must be intact.", 1000, 3500),
    ("OEM BMW E30 M3 Front Chin Spoiler S14", "Seeking original BMW E30 M3 front air dam/chin spoiler. Must be crack-free. S14 engine bay clearance confirmed. No resin repairs.", 800, 2500),
    ("Disc Brake Conversion Kit 1966–1970 Chevrolet Impala Front", "Need a complete front disc brake conversion kit for 1966–1970 Chevy Impala. Must include calipers, rotors, brackets, and hardware. Bolt-on preferred.", 300, 700),
    ("Air-Cooled VW Type 1 Beetle 1600cc Dual-Port Engine Complete", "Seeking a complete 1600cc dual-port air-cooled VW Beetle engine. Running or freshly rebuilt. Carbureted. Type 1 case.", 500, 1500),
],
"collectibles": [
    ("1986 Topps Baseball Complete Set 792 Cards", "Seeking a complete 1986 Topps baseball set (all 792 cards). Must include Barry Bonds, Bo Jackson, and Roger Clemens rookies. Cards in EX or better condition.", 80, 250),
    ("Meissen Porcelain Figurine — 18th Century Shepherd with Sheep", "Looking for a Meissen porcelain figurine from the 18th century. Shepherd or pastoral scene with sheep. Must have blue crossed swords mark underneath. No repairs.", 1500, 6000),
    ("1952 Topps Mickey Mantle Baseball Card", "Seeking the iconic 1952 Topps Mickey Mantle #311. Graded copy (PSA or SGC) preferred. Any grade considered. Authentic only.", 5000, 50000),
    ("Complete Set Star Wars 1977 Topps Trading Cards 66-Card Series 1", "Looking for complete 1977 Topps Star Wars Series 1 (66 cards + 11 stickers). Must be the complete set. EX condition or better.", 150, 500),
    ("1969 Proof Set US Coins — Original Mint Box", "Seeking the 1969-S proof set in original government envelope/box. All 5 coins must be present and untouched. Cameo surfaces preferred.", 30, 80),
    ("First Edition Harry Potter Philosopher's Stone 1997", "Need a first UK edition of Harry Potter and the Philosopher's Stone (Bloomsbury, 1997). First printing with number line 10 9 8 7 6. Complete and intact.", 3000, 10000),
    ("Vinyl Record — The Beatles White Album 1968 UK Mono First Press", "Seeking The Beatles White Album original UK Mono first pressing (PMC 7067/8). Low serial number preferred. Both LPs and poster must be present. No serious scratches.", 500, 2500),
    ("1990 Upper Deck Ken Griffey Jr. Rookie Card PSA 10", "Looking for Ken Griffey Jr. 1989 Upper Deck #1 rookie card graded PSA 10 Gem Mint. Authenticated and slabbed. No trimmed or altered cards.", 300, 900),
    ("Pre-War Superman Action Comics #1 1938 — Any Condition", "Seeking Action Comics #1 from June 1938, first appearance of Superman. Any condition from Very Good to Poor considered. Must be authenticated.", 100000, 500000),
    ("Tiffany Studios Wisteria Table Lamp Original", "Looking for an original Tiffany Studios Wisteria leaded glass table lamp with bronze base. Must be signed. No replaced glass panels.", 15000, 80000),
    ("Complete Set 2009 Bowman Chrome Baseball Prospect Autographs", "Seeking complete set of 2009 Bowman Chrome baseball prospect autographs including Mike Trout auto. PSA or Beckett graded preferred.", 1000, 5000),
    ("Pokemon Base Set 1st Edition Booster Box Sealed", "Looking for a sealed 1st Edition Pokémon Base Set booster box. Must be factory sealed with correct holographic printing. Authenticated.", 100000, 200000),
    ("1955 Double Die Penny Lincoln Cent DDO", "Seeking 1955 Lincoln Cent DDO (Double Die Obverse). Graded PCGS or NGC preferred, minimum F12. Well-struck doubling on date and LIBERTY.", 500, 3000),
    ("Set of 4 Corgi Toys No. 270 James Bond Aston Martin", "Seeking Corgi Toys No. 270 Aston Martin DB5 James Bond edition. Must include ejector seat figure, tyre slashers, and bulletproof shield. Original box.", 80, 300),
    ("Hot Wheels Red Line 1968 Custom Camaro — Rare Color", "Looking for a 1968 Hot Wheels Red Line Custom Camaro in a rare color (antifreeze, python, spectraflame aqua). Must have working red line tires.", 100, 500),
    ("1933 Goudey Ruth #53 Baseball Card SGC Graded", "Seeking 1933 Goudey Babe Ruth #53. SGC or PSA graded preferred. Any authentic grade from VG to EX welcomed.", 3000, 15000),
    ("Vintage Lionel Trains 0-Gauge Set 1950s Complete", "Looking for a 1950s Lionel O-Gauge set with locomotive, tender, and at least 6 cars. Must include original track and transformer. Working condition.", 300, 1000),
    ("Banksy 'Balloon Girl' Limited Edition Print Authenticated", "Seeking Banksy Balloon Girl screen print, authenticated by Pest Control. Any edition. Must include original certificate of authenticity and framing documentation.", 5000, 30000),
    ("1979 Topps Football Walter Payton PSA 9", "Need Walter Payton 1977 Topps #360 or 1979 Topps card graded PSA 9 or better. No post-grade issues. Authenticated.", 200, 700),
    ("Antique Japanese Katana Edo Period with Saya and Koshirae", "Seeking an Edo Period Japanese katana with original saya (scabbard) and koshirae fittings. Must have papered attribution (NBTHK or NTHK). No cracks in blade.", 3000, 20000),
    ("1984 Garbage Pail Kids Series 1 OS1 Complete 82-Card Set", "Looking for a complete 1984 Topps Garbage Pail Kids OS1 set (82 cards). Both a and b variants. EX or better condition. No marks or tears.", 300, 1000),
    ("Vintage 1974 Parker Brothers Monopoly Set Complete", "Seeking a 1974 Parker Brothers Monopoly standard set. Must have all properties, dice, tokens (including iron and thimble), and money. No missing pieces.", 30, 80),
    ("1st Edition Charizard 4/102 Pokémon Card PSA 9", "Need 1st Edition Holographic Charizard 4/102 Base Set Pokémon card graded PSA 9 Mint. No whitening or print defects. Authenticated by PSA.", 3000, 10000),
    ("Enid Blyton Noddy First Edition 1949 'Noddy Goes to Toyland'", "Seeking the first edition of Enid Blyton's Noddy Goes to Toyland (1949, Sampson Low). Complete with all illustrations. Good or better condition.", 200, 600),
    ("Marvel Comics Amazing Fantasy #15 (1962) CGC 4.0", "Looking for Amazing Fantasy #15 first appearance of Spider-Man, graded CGC 4.0 or better. Must have clean label and no restoration.", 8000, 30000),
    ("Rare Austrian 1780 Maria Theresa Thaler Silver Coin MS62", "Seeking an 1780 restrike or original Maria Theresa Thaler silver dollar graded PCGS or NGC MS62 or better. Original high-grade specimens.", 40, 100),
    ("Complete 1970 Topps Football Set 263 Cards", "Looking for a complete 1970 Topps Football set (263 cards). Must include Terry Bradshaw rookie. VG or better across the set.", 300, 900),
    ("Vintage Mechanical Wristwatch — Patek Philippe Calatrava 1940s", "Seeking a 1940s–1950s Patek Philippe Calatrava manual wind dress watch. Must be running. Original dial preferred. No dial restoration.", 8000, 25000),
    ("Dale Earnhardt 1980 Topps Racing Card PSA 9", "Looking for Dale Earnhardt 1980 Topps #96 rookie card graded PSA 9 Mint or better. No surface issues. Authenticated.", 200, 600),
    ("1971 NM Set Bobby Orr Topps Hockey Cards", "Seeking a set of Bobby Orr Topps hockey cards from the 1971–72 season in NM or better condition. Individual cards or complete set.", 200, 700),
],
"real-estate": [
    ("Parking Spot — Downtown Chicago Near Millennium Park", "Seeking a monthly parking spot in downtown Chicago, preferably in a covered garage within 3 blocks of Millennium Park. Indoor, 24/7 access, compatible with EV charging.", 150, 350),
    ("Studio Apartment for Rent — Shibuya, Tokyo 6 Months", "Looking for a furnished studio apartment in Shibuya or Harajuku, Tokyo for a 6-month period starting April. Budget under ¥150,000/month. Near subway station.", 1000, 1500),
    ("Storage Unit 10x20 Climate Controlled — Los Angeles", "Seeking a 10x20 climate-controlled storage unit in Los Angeles (West Side preferred). Must allow daily access and be ground floor. Need it for 3 months minimum.", 150, 350),
    ("Parking Spot — Canary Wharf London Monthly", "Looking for a secure monthly parking space near Canary Wharf, London. Covered or underground preferred. Need EV charging capability.", 250, 500),
    ("Shared Office Desk — Manhattan Tech Startup Coworking", "Seeking a dedicated desk in a coworking space in Manhattan, preferably near Union Square or Flatiron. Must include high-speed internet, meeting room credits, and 24/7 access.", 400, 900),
    ("1BR Apartment for Sublet — San Francisco Mission District", "Looking for a 1-bedroom apartment sublet in SF's Mission District for 3 months (May–July). Under $2,500/month. Pet-friendly (1 small dog). Furnished or unfurnished.", 2000, 3000),
    ("Garage Workshop Space — Seattle 500 sqft Monthly", "Seeking a garage or warehouse workshop space to rent monthly in Seattle. Need 3-phase power, good ventilation, and 500+ sqft. Fabrication work.", 400, 900),
    ("Commercial Kitchen Rental — Part-Time Toronto", "Seeking a licensed commercial kitchen in Toronto for part-time rental (2 days/week). Must be inspected by Toronto Public Health. Cold storage required.", 300, 700),
    ("Vacation Rental — Tuscany Farmhouse 2 Weeks August", "Looking for a farmhouse or villa rental in Tuscany for 2 weeks in August. Must sleep 8+ people, have a pool, and be within 30 minutes of Florence or Siena.", 3000, 8000),
    ("Small Retail Space for Pop-Up — Melbourne CBD 1 Month", "Seeking a small retail pop-up space (200–400 sqft) in Melbourne CBD for 1 month. Street level, must allow signage. Flexible lease.", 1000, 2500),
],
"food": [
    ("Kobe A5 Wagyu Beef Ribeye 500g Grade 12", "Seeking authentic Japanese Kobe A5 Wagyu beef ribeye, at least 500g, Grade 12. Must come with certificate of authenticity from Japanese Meat Grading Association.", 150, 400),
    ("Wedding Catering for 80 Guests — 3-Course Formal Dinner", "Looking for a licensed caterer to provide full service catering for an 80-guest wedding reception. 3-course sit-down dinner, bar service, and waitstaff included.", 4000, 10000),
    ("Weekly Meal Prep Service — Low-Carb High Protein 5 Days", "Seeking a personal meal prep chef for weekly delivery of 5-day meal plan (low-carb, high-protein). 3 meals per day. Must be licensed and insured.", 200, 500),
    ("Fresh Black Truffles — Périgord France 200g", "Looking for fresh black Périgord truffles (Tuber melanosporum) from France. Minimum 200g. Must be harvested within 72 hours of delivery. Food safety certificate required.", 200, 500),
    ("Custom Birthday Cake — 5-Tier Fondant Art Cake", "Seeking a skilled cake artist for a custom 5-tier fondant cake for 100 guests. Must be able to create detailed sculpted decorations. Tasting appointment required.", 500, 1500),
    ("Monthly Specialty Coffee Subscription — Single Origin", "Looking for a direct monthly subscription for single-origin specialty coffees, preferably Ethiopia or Panama Geisha. Whole bean, 500g/month minimum.", 30, 80),
    ("Handmade Artisan Pasta — Fresh Weekly Delivery", "Seeking a local artisan pasta maker for weekly delivery of fresh pasta varieties (pappardelle, tagliatelle, gnocchi). 2kg per week. Organic ingredients preferred.", 40, 100),
    ("Imported Italian Truffled Products Gift Basket", "Need a premium gift basket from Italy containing white truffle oil, truffle honey, truffle salt, and canned truffles. Must be authentic Italian origin.", 80, 200),
    ("Healthy Meal Delivery — Plant-Based 1 Month", "Looking for a plant-based meal delivery service for one month. 2 meals per day, 5 days per week. No artificial additives. Allergen-free from nuts.", 300, 700),
    ("Halal Butcher — Whole Lamb 20kg Dressed", "Seeking a certified halal butcher to provide a whole dressed lamb, approximately 20kg. Must be ISNA or equivalent halal certification. Vacuum-packed preferred.", 150, 350),
],
"sports": [
    ("Callaway Paradym AI Smoke Driver 10.5° Regular Flex", "Looking for Callaway Paradym AI Smoke driver, 10.5 degrees, regular or stiff flex with Mitsubishi Tensei shaft. Less than 10 rounds of play.", 300, 500),
    ("Wilson Pro Staff RF97 Autograph Racket Roger Federer", "Seeking Wilson Pro Staff RF97 Autograph tennis racket. Must be the Roger Federer signature edition. Includes original grip and cap. Used once or new.", 200, 350),
    ("NFL Super Bowl LIX 2025 Tickets — Lower Bowl", "Looking for two Super Bowl LIX game tickets in the lower bowl at Caesars Superdome. Official Ticketmaster transfer only. Aisle seats preferred.", 3000, 8000),
    ("Yonex Voltric Z-Force II Badminton Racket 3U", "Seeking Yonex Voltric Z-Force II, 3U weight, unstrung or freshly strung with BG80. Must be authentic Yonex. No frame cracks.", 150, 280),
    ("Peloton Bike+ Second Generation", "Looking for Peloton Bike+ (2nd gen with rotating screen). Must include Peloton shoes, weights, and heart rate band. Annual membership transferable.", 1200, 2000),
    ("Titleist Pro V1 Golf Balls 2024 — 5 Dozen", "Need 5 dozen Titleist Pro V1 or Pro V1x golf balls, 2024 model. Must be unused (mint in box or sleeve). No lake balls or repainted balls.", 100, 200),
    ("Ski Package — Volkl Mantra M6 184cm + Marker Bindings", "Seeking Volkl Mantra M6 184cm ski with Marker Griffon or similar all-mountain binding. Must include poles. Less than 10 ski days. No edge damage.", 500, 900),
    ("Surfboard — Firewire Slater Designs Omni 5'10\"", "Looking for a Firewire Slater Designs Omni surfboard, 5'10\". Must have no dings, cracks, or delamination. Includes traction pad and leash preferred.", 400, 700),
    ("Climber's Rack — Complete Trad Climbing Gear Set", "Need a complete trad climbing rack: BD Camalots 0.3–4, nuts set, slings, locking biners, and belay device. DMM or Black Diamond only.", 500, 1200),
    ("Real Madrid vs. Barcelona El Clásico 2025 Tickets ×2", "Seeking two tickets to Real Madrid vs. Barcelona El Clásico match at Santiago Bernabéu. Any section. Official transfer only. Spring 2025 fixture.", 500, 1500),
    ("Coaching Sessions — Tennis — 10-Pack USTA 4.0+ Instructor", "Looking for a USTA-certified tennis coach for a 10-lesson package. Must be USTA rated 5.0+ and have experience coaching 4.0-level adults.", 400, 900),
    ("Scuba Diving BCDs — Aqualung Pro HD Size M", "Seeking Aqualung Pro HD BCD in medium size. Must include all inflator hose connections and dump valves intact. Under 50 dives.", 250, 450),
    ("CrossFit Equipment Set — Rogue Barbell + Bumpers", "Looking for a complete CrossFit home setup: Rogue Ohio barbell, 200kg bumper plate set, pull-up rig, and kettlebells (16, 24, 32kg).", 1500, 3000),
],
"tools": [
    ("Milwaukee M18 FUEL Hammer Drill + Impact Driver Combo", "Seeking Milwaukee M18 FUEL combo kit (2897-22) with hammer drill and impact driver. Must include 2 batteries (5.0Ah+) and rapid charger. Under 10 hours use.", 300, 500),
    ("DeWalt 20V MAX Circular Saw 7-1/4\" DCS575T2", "Looking for DeWalt DCS575T2 circular saw kit with FlexVolt batteries. Must include blade guard and case. Blade must not be worn.", 200, 380),
    ("Festool Domino DF 500 Joiner — Complete Set", "Seeking Festool Domino DF 500 with Systainer case. Must include multiple cutter sizes and spare dominoes. All fences and guides present.", 700, 1200),
    ("Makita Track Saw SP6000J1 Plunge Circular Saw", "Need Makita SP6000J1 track saw with 55\" guide rail. All safety mechanisms must function. Anti-splinter strips intact.", 400, 700),
    ("Snap-On 1/2\" Drive Impact Wrench Electric CTIW3100A", "Seeking Snap-on CTIW3100A 3/4\" drive air impact wrench or CTIW3100A equivalent. Must be Snap-on branded. All anvil positions must lock.", 400, 800),
    ("Welding Outfit — Lincoln Electric Power MIG 260MP", "Looking for Lincoln Electric Power MIG 260MP multi-process welder. Must include MIG gun, TIG torch, and stick electrode holder. Under 100 hours.", 1200, 2000),
    ("Vintage Stanley No. 45 Combination Plane Complete", "Seeking a complete vintage Stanley No. 45 combination plane with all blades (48 cutters), two fences, depth stop, and original box. Blades must hold an edge.", 200, 600),
    ("Powermatic 1792001K Model 2000 15\" Planer", "Need Powermatic 2000 15-inch planer with helical head. Must have all infeed/outfeed rollers functioning. Under 200 hours. Comes with stand.", 1500, 3000),
    ("Bosch GTS1041A Jobsite Table Saw with Stand", "Seeking Bosch GTS1041A REAXX job site table saw. Must include gravity-rise stand, riving knife, and zero-clearance insert. Active Injury Mitigation must function.", 500, 900),
    ("Metabo HPT 36V MultiVolt 10\" Miter Saw C3610DRJQ4", "Looking for Hitachi/Metabo HPT 36V MultiVolt sliding compound miter saw. Must include 2 batteries and charger. Laser guide must work.", 400, 700),
],
"music": [
    ("Gibson Les Paul Standard 60s Heritage Cherry Sunburst", "Seeking a Gibson Les Paul Standard 60s in Heritage Cherry Sunburst. Original hardshell case required. No modifications to pickups or electronics.", 2000, 3500),
    ("Roland TD-17KVX Electronic Drum Kit Complete Set", "Need Roland TD-17KVX electronic drum kit. Must include all pads, hi-hat controller, module, and throne. PDX-12 snare required. Under 2 years old.", 1200, 2000),
    ("Fender American Professional II Stratocaster Miami Blue", "Seeking Fender American Pro II Strat in Miami Blue with rosewood neck. Must include original case and all candy. No modifications.", 1200, 1800),
    ("Moog Subsequent 37 Analog Synthesizer Black", "Looking for Moog Subsequent 37 paraphonic synth. All keys must trigger and all pots must sweep without crackling. Original box preferred.", 900, 1600),
    ("Rhodes Mark 1 Stage Piano 73-Key 1973–1974", "Seeking a 1973–1974 Fender Rhodes Mark 1 Stage Piano, 73 keys. All 73 keys must play and sustain with minimal dead tines. Recently serviced preferred.", 1200, 2500),
    ("Steinway Model M 5'7\" Grand Piano Ebony Polished", "Looking for a Steinway Model M (5'7\") grand piano in polished ebony. Must be recently tuned and regulated. Under 1970 vintage. All pedals functional.", 20000, 45000),
    ("Focusrite Scarlett 18i20 3rd Gen Audio Interface", "Need Focusrite Scarlett 18i20 3rd Gen USB interface. All 18 inputs and 20 outputs must function. Must include power supply and all cables.", 350, 550),
    ("Universal Audio Apollo x8 Thunderbolt 3 Interface", "Seeking UA Apollo x8 with Thunderbolt 3 connection. Must include all UAD plug-ins licensed. Analog summing and all I/O must work.", 1500, 2500),
    ("Sennheiser HD 800 S Open-Back Headphones", "Looking for Sennheiser HD 800 S headphones. Must include original cable, balanced XLR adapter, and carry case. No driver issues or driver rattle.", 900, 1400),
    ("Vintage Fender Stratocaster 1963 Original Sunburst", "Seeking a 1963 Fender Stratocaster in original sunburst. All-original components preferred. Certificates, CITES if applicable. No headstock breaks.", 30000, 80000),
    ("Korg Minilogue XD Module Polyphonic Desktop Synth", "Looking for Korg Minilogue XD Module desktop synthesizer. Must include power adapter. All oscillators and multi-engine sounds must work.", 350, 550),
    ("Selmer Mark VI Alto Saxophone 1965 — Original Lacquer", "Seeking a 1965 Selmer Mark VI alto saxophone with original lacquer. Must be fully playable with good pad seal. Original case and neck preferred.", 7000, 18000),
    ("Native Instruments Maschine+ Standalone Sampler", "Searching for NI Maschine+ standalone. Must include power supply and USB cable. All sample pads must register. Firmware updated.", 700, 1000),
    ("Martin D-28 Acoustic Guitar 2020 or newer", "Looking for a Martin D-28 acoustic guitar, 2020 or newer. Must have original case and nut. No cracks, repairs, or neck resets.", 1800, 2800),
    ("Ableton Live 12 Suite License Transferable", "Seeking a transferable Ableton Live 12 Suite license. Must be unregistered or transferable per Ableton TOS. Includes Max for Live. Digital only.", 400, 650),
],
"books": [
    ("Charles Dickens First Edition 'A Christmas Carol' 1843", "Seeking the 1843 first edition of A Christmas Carol by Charles Dickens. Original red cloth binding. All 4 hand-colored plates present. Good condition.", 3000, 12000),
    ("J.R.R. Tolkien 'The Hobbit' First Edition 1937", "Looking for the 1937 first edition of The Hobbit by J.R.R. Tolkien. Allen & Unwin publisher. Original dust jacket a significant plus.", 20000, 60000),
    ("Early Printing Darwin 'On the Origin of Species' 1859", "Seeking an early printing (first through third) of Darwin's On the Origin of Species. Murray publisher London. Any condition.", 5000, 30000),
    ("Ian Fleming James Bond Collection First Editions Complete Set", "Looking for a complete set of Ian Fleming James Bond first editions (all 14 novels). Cape publisher, UK. Dust jackets preferred but not required.", 10000, 50000),
    ("Vintage Penguin Crime Paperbacks 1935–1950 Lot of 20", "Seeking a lot of at least 20 vintage Penguin Crime (orange/white stripe) paperbacks from 1935–1950. Good or better condition. No broken spines.", 80, 250),
    ("Medical Textbook — Harrison's Principles of Internal Medicine 21st Ed", "Need Harrison's Principles of Internal Medicine, 21st Edition, two-volume set. Must be 2022 or later printing. Access code to online version preferred.", 150, 280),
    ("Complete Oxford English Dictionary 20-Volume Second Edition", "Seeking the 20-volume second edition of the Oxford English Dictionary. Complete set. Must have all volumes present with no water damage.", 800, 1500),
    ("Agatha Christie First Editions Set — 10 Poirot Novels", "Looking for a collection of Agatha Christie Hercule Poirot first editions. William Collins Sons publisher. Dust jackets preferred. At least 10 titles.", 2000, 8000),
    ("Rare Sanskrit Manuscript — Bhagavad Gita 19th Century", "Seeking a 19th-century handwritten Sanskrit manuscript of the Bhagavad Gita. Must be on palm leaf or paper. Provenance documentation preferred.", 1000, 5000),
    ("Virginia Woolf First Edition 'Mrs Dalloway' 1925", "Looking for the 1925 first edition of Mrs Dalloway by Virginia Woolf. Hogarth Press, Richmond. Original boards preferred. No missing pages.", 2000, 8000),
],
"pets": [
    ("Premium Dog Food — Orijen Original 25kg Bulk", "Seeking Orijen Original dry dog food in 25kg bag. Must be within 3 months of manufacture date. No opened bags. For a large breed adult dog.", 150, 250),
    ("Dog Boarding — 2 Weeks In-Home for German Shepherd", "Looking for in-home dog boarding for 2 weeks for a 3-year-old female German Shepherd (35kg, vaccinated, spayed). Must have experience with large dogs.", 400, 800),
    ("Maine Coon Kitten — TICA Registered Silver Classic", "Seeking a TICA-registered Maine Coon kitten, silver classic tabby preferred. Must come from health-tested parents (HCM, SMA, PKD). At least 12 weeks old.", 1500, 3000),
    ("Equine Veterinarian for Annual Wellness Check — 3 Horses", "Need a licensed equine veterinarian to perform annual wellness checks for 3 horses including Coggins test, Rabies, and EEW vaccines. Farm call.", 300, 600),
    ("Aquarium Setup — 200L Planted Tropical Tank Complete", "Looking for a 200-liter planted tropical aquarium setup including tank, stand, lighting (Fluval or Chihiros), CO2 system, and filter. Running or broken down.", 500, 1000),
    ("Professional Cat Grooming — Himalayan 2 Cats Monthly", "Seeking a professional cat groomer experienced with Persians or Himalayans for 2 monthly grooming appointments. Must include lion cut or comb cut option.", 80, 180),
    ("Bird Cage — Large Macaw Cage 60x40x72\" Stainless Steel", "Need a large macaw-sized stainless steel cage, at least 60x40x72 inches. Must have at least 2 doors and seed guard. No rust or sharp edges.", 800, 1800),
    ("Dog Training — 6-Session Obedience Course Board-and-Train", "Seeking a board-and-train dog obedience program for a 1-year-old Labrador. Must be force-free or balanced training. 6 sessions minimum with follow-up.", 800, 2000),
    ("Premium Horse Hay — Timothy First Cut 2 Ton Delivery", "Looking for a reliable supplier of first-cut Timothy hay, 2 tons delivered. Must be green, dry, and free of dust or mold. Regular monthly supply preferred.", 400, 800),
    ("Reptile Terrarium — Exo Terra Large 90x45x90cm", "Seeking Exo Terra Glass Terrarium in large size (90x45x90cm). Must have front-opening doors and dual screen top intact. No chips or cracks in glass.", 200, 450),
],
"health": [
    ("Theragun PRO Gen 5 Percussive Therapy Device", "Seeking Theragun PRO 5th generation. Must include all 6 attachments, carry case, and charging cable. Under 20 hours of use.", 350, 550),
    ("Medical-Grade Pulse Oximeter Masimo MightySat Rx Fingertip", "Looking for a Masimo MightySat Rx fingertip pulse oximeter. Must include Bluetooth and all LED indicators working. Under 100 hours use.", 150, 280),
    ("Weekly Yoga Sessions — Private 1-on-1 Ashtanga Certified", "Seeking a certified Ashtanga yoga instructor for weekly 90-minute private sessions. Must have RYT-500 certification. Home studio or my location.", 60, 150),
    ("CPAP Machine — ResMed AirSense 11 AutoSet", "Need a ResMed AirSense 11 AutoSet with humidifier. Must include heated tubing and mask. Under 2 years old. Data card wiped or reset.", 500, 900),
    ("Standing Therapy Scale — Tanita BC-601 Body Composition", "Seeking Tanita BC-601 segmental body composition analyzer. Must be professional grade. All foot and hand sensors functional. Calibration current.", 400, 800),
    ("Hyperbaric Oxygen Chamber — Personal/Home Use 1.3 ATA", "Looking for a personal hyperbaric chamber, 1.3 ATA, mild grade. Must include compressor, inflate/deflate valve, and oxygen concentrator port. Under 5 years old.", 3000, 6000),
    ("Continuous Glucose Monitor Starter Kit — Libre 3 Compatible", "Seeking Abbott FreeStyle Libre 3 reader and sensor kit. Must include at least 3 months supply of sensors. Sealed boxes only. Not expired.", 150, 350),
    ("Medical Massage Chair — Inada Dreamwave Shiatsu", "Need an Inada Dreamwave full-body massage chair. All massage programs must function. No leather peeling. Must be in smoke-free home. Manual included.", 2000, 4000),
    ("Red Light Therapy Panel — Joovv Solo 3.0 Mid-Size", "Seeking Joovv Solo 3.0 mid-size red light therapy panel. Must include all mounting hardware and power supply. All LEDs must illuminate fully.", 400, 700),
    ("Air Purifier — IQAir HealthPro Plus 360° HEPA", "Looking for an IQAir HealthPro Plus air purifier. Must include HyperHEPA filter under 2 years of use. All fan speeds must work. Smoke-free home.", 600, 1100),
],
"crafts": [
    ("Bernina 790 Plus Sewing Machine with Embroidery Module", "Seeking Bernina 790 Plus sewing and embroidery machine. Must include DesignWorks software and embroidery module. Serviced within 12 months. Under 100 hours.", 4000, 7000),
    ("Pottery Wheel — Brent Model C Electric Wheel", "Looking for a Brent Model C pottery wheel. Must have all speeds functioning. Splash pan must be included. Under 200 hours use.", 600, 1000),
    ("Cricut Maker 3 Smart Cutting Machine + Accessories Bundle", "Seeking Cricut Maker 3 with adaptive tool system. Must include rotary blade, knife blade, and scoring stylus. Smart Vinyl and iron-on vinyl bundles a plus.", 250, 450),
    ("Professional Loom — Ashford Table Loom 8-Shaft 24\"", "Looking for an Ashford 8-shaft table loom, 24-inch weaving width. Must include all heddles, reeds, and accessories. All shafts must raise and lower.", 400, 800),
    ("Screen Printing Press — Riley Hopkins 6-Color 4-Station", "Need a Riley Hopkins 6-color, 4-station screen printing press. Must include all platens and be level. Under 3 years old. Ink not required.", 1000, 2000),
    ("Resin Art Supplies — Full Starter Kit with UV Lamp", "Seeking a complete UV resin art starter kit including UV resin (clear and colors), silicone molds, UV lamp 36W, mixing tools, and glitter pigments.", 80, 180),
    ("Spinning Wheel — Ashford Traveller Double Drive", "Looking for an Ashford Traveller spinning wheel with double drive system. Must include all bobbins and accessories. Must spin smoothly without wobble.", 400, 700),
    ("Embroidery Hoop Set Professional — 5 Sizes with Stand", "Seeking a high-quality embroidery hoop set in 5 sizes (3\", 5\", 6\", 8\", 10\") with professional stand. Solid wood preferred.", 60, 150),
    ("Leather Working Tools Set — Tandy Leather Pro Grade", "Need a complete leather crafting tool set including leather punches, bevelers, stamping tools, needles, and wax. Professional or intermediate grade.", 100, 250),
    ("Digital Embroidery Machine — Brother PE900 6x10 Inch Hoop", "Seeking Brother PE900 embroidery machine. Must include the 6x10 inch hoop and USB port. Under 5 years old. Calibration must be current.", 400, 700),
],
"garden": [
    ("Riding Lawn Mower — John Deere X350 42\" Deck", "Looking for a John Deere X350 riding mower with 42-inch deck. Must start reliably and cut evenly. Under 200 hours. Blades recently sharpened.", 1500, 2500),
    ("Greenhouse Kit — 12x16 Ft Polycarbonate Heavy Duty", "Seeking a 12x16-foot polycarbonate greenhouse kit. Must include galvanized frame, sliding door, and all panels. Used one season or new.", 700, 1500),
    ("Drip Irrigation System — Complete Set for 1/4 Acre", "Need a complete drip irrigation system for a quarter-acre vegetable garden. Must include timer, pressure regulator, soaker hoses, and all fittings.", 150, 350),
    ("Professional Landscaping — Backyard Patio Design & Install", "Looking for a licensed landscaper to design and install a natural stone patio approximately 400 sqft. Must include grading, base, and sealing. Permit pulled.", 4000, 12000),
    ("Rare Heirloom Tomato Seed Collection 50+ Varieties", "Seeking a collection of at least 50 varieties of certified organic heirloom tomato seeds. Must include Brandywine, Cherokee Purple, and Green Zebra. Fresh dated.", 30, 80),
    ("Power Tiller/Cultivator — Honda FG110 Mini Tiller", "Need Honda FG110 mini tiller. Must start on 3rd pull or fewer. All tines must be present and intact. Oil changed recently.", 200, 400),
    ("Rain Barrel System — 275 Gallon IBC Tote + Stand", "Looking for a food-grade 275-gallon IBC tote with stand and spigot for rainwater harvesting. Must be clean inside with no odor from previous contents.", 150, 350),
    ("Raised Garden Bed — Cedar 4x8 Triple Layer 3-Pack", "Seeking 3x cedar raised garden beds (4x8 foot, 3-layer tall). Must be untreated cedar. No rot or structural damage. Assembled or flat-packed.", 200, 400),
    ("Electric Chainsaw — Stihl MSA 200 C-B With Battery", "Need Stihl MSA 200 C-B battery chainsaw. Must include AP 300 battery and charger. Chain must have good teeth. Bar must be straight.", 300, 550),
    ("Landscape Lighting Kit — 12V Solar Pathway Lights 20-Pack", "Seeking 20-pack solar-powered landscape pathway lights. Must be stainless steel or heavy-duty. Must stay lit all night after full charge.", 80, 200),
],
"other": [
    ("Camping Trailer — Airstream Bambi Sport 16RB", "Seeking an Airstream Bambi Sport 16RB. Under 5 years old. Must be rust-free with no delamination. All appliances must function. Solar panel preferred.", 35000, 60000),
    ("Vintage Rolex Submariner Date 16610 Tritium Dial", "Looking for a Rolex Submariner Date ref 16610 with tritium or patina dial from 1988–1996. Must be full set (box and papers). Serviced recently.", 8000, 18000),
    ("Professional Espresso Machine — La Marzocco Linea Mini", "Seeking La Marzocco Linea Mini home espresso machine. Must include steam wand and drip tray. Under 3 years old. No leaks or pump issues.", 3500, 6000),
    ("Vintage Racing Helmet — Bell Star 1970s Fiberglass", "Looking for an original Bell Star 1970s open-face racing helmet. Good condition, original paint. Chin strap and visor intact. No damage.", 200, 600),
    ("Artisan Custom Mechanical Keyboard — TGR Alice", "Seeking a TGR Alice custom mechanical keyboard. Must include PCB, plate, and case. Linear switches preferred (Gateron Yellow or Holy Pandas). Fully built.", 400, 900),
    ("Drone Racing Kit — ImpulseRC Apex HD 5\" Frame + Motors", "Looking for a complete 5-inch FPV racing drone kit: ImpulseRC Apex HD frame, 4x 2306 motors, 45A ESC, F7 FC, and FPV camera. Soldered OK.", 300, 600),
    ("Vintage Polaroid SX-70 Land Camera — Folding SLR", "Seeking a Polaroid SX-70 original land camera. Must have functional shutter and mirror. All folding hinges intact. Will test with fresh film.", 80, 250),
    ("Kimono — Vintage Silk Furisode 1960s Japan", "Looking for a vintage silk furisode kimono from 1960s–1970s Japan. Must be in excellent condition with coordinating obi. Hand-painted or Nishijin weave preferred.", 200, 800),
    ("Antique French Clock — Jaeger-LeCoultre Atmos 1950s", "Seeking a 1950s Jaeger-LeCoultre Atmos clock. Must be running (perpetual motion). Original gold or brass case. Serial number verifiable.", 1500, 4000),
    ("3D Printer — Bambu Lab X1 Carbon Combo", "Looking for Bambu Lab X1 Carbon Combo with AMS (4-color). Must include all nozzles and RFID spools. Under 500 hours of printing.", 900, 1400),
    ("Lego Millennium Falcon 75192 Sealed in Box", "Seeking Lego Ultimate Collector Series Millennium Falcon set 75192. Must be completely sealed and unopened. Original retail box in excellent condition.", 700, 1100),
    ("French Press Coffee Maker — Bodum Chambord 8-Cup", "Looking for a Bodum Chambord 8-cup (1 liter) French press. Must have all original components including plunger, filter, and glass carafe. Carafe crack-free.", 30, 60),
    ("Road Trip Van Conversion — Ford Transit 250 Custom", "Seeking a professionally converted Ford Transit 250 camper. Must have bed, kitchen, solar, and storage. Under 100,000 miles. 2018 or newer.", 25000, 60000),
    ("Olympic Barbell Set — Rogue Ohio Bar + 300kg Iron Plates", "Need Rogue Ohio Bar 20kg with collar and 300kg worth of iron plates (10, 25, 45 lb). Must all be matching width. No cracks in cast iron plates.", 800, 1500),
    ("Portable Power Station — EcoFlow DELTA Pro 3600Wh", "Seeking EcoFlow DELTA Pro 3600Wh portable power station. Must include original power cable and smart panel adapter. Under 200 charge cycles.", 2000, 3500),
    ("Nespresso Vertuo Next Deluxe + Aeroccino Bundle", "Need Nespresso Vertuo Next Deluxe in Dark Chrome with Aeroccino 4 milk frother. Must be complete with drip tray and water tank. Under 1 year old.", 150, 280),
    ("First Aid Kit — Trauma Level 2 IFAK Military Grade", "Seeking an IFAK (Individual First Aid Kit) at Trauma Level 2 including tourniquet (CAT or SOFTT-W), chest seal, and QuikClot gauze. Unused sealed items.", 80, 200),
    ("Smart Home Hub — Control4 EA-5 + 8 Dimmers", "Looking for a Control4 EA-5 controller with at least 8 Smart Dimmers. Must include licenses active. All zones must respond. Recent firmware.", 1500, 3500),
    ("Vintage 1980s Casio G-Shock DW-5000C-1A Original", "Seeking an original 1983/1984 Casio G-Shock DW-5000C-1A. Must have original module with orange start button. LCD must be clear with no fading.", 300, 1000),
    ("Acoustic Guitar Case — TKL or SKB Hard Shell for Dreadnought", "Seeking a high-quality hard shell guitar case for dreadnought acoustic. TSA-lockable hinges preferred. Must fit Martin D-28 or similar.", 60, 150),
],
}

# ── STATUS DISTRIBUTION ──────────────────────────────────────────────────────────
# 850 open, 100 fulfilled, 50 expired, total 1000

def build_wants():
    category_counts = {
        "electronics": 100,
        "vehicles": 60,
        "auto-parts": 80,
        "collectibles": 80,
        "services": 100,
        "education": 60,
        "furniture": 60,
        "clothing": 50,
        "real-estate": 30,
        "food": 40,
        "sports": 50,
        "tools": 40,
        "music": 40,
        "books": 30,
        "pets": 30,
        "health": 30,
        "crafts": 30,
        "garden": 30,
        "other": 60,
    }

    wants = []
    statuses = ["open"] * 850 + ["fulfilled"] * 100 + ["expired"] * 50
    random.shuffle(statuses)

    idx = 0
    for cat, count in category_counts.items():
        pool = WANTS[cat]
        for i in range(count):
            tmpl = pool[i % len(pool)]
            title, desc, min_p, max_p = tmpl
            city, author = pick_location()
            # Pick a currency roughly matching location
            city_lower = city.lower()
            if any(x in city_lower for x in ["japan","tokyo","osaka"]):
                currency = "JPY"
                price = round(random.randint(min_p, max_p) * 145)
            elif any(x in city_lower for x in ["china","beijing","shanghai","shenzhen"]):
                currency = "CNY"
                price = round(random.randint(min_p, max_p) * 7.2)
            elif any(x in city_lower for x in ["korea","seoul","busan"]):
                currency = "KRW"
                price = round(random.randint(min_p, max_p) * 1330)
            elif any(x in city_lower for x in ["uk","london","manchester","edinburgh","birmingham"]):
                currency = "GBP"
                price = round(random.randint(min_p, max_p) * 0.80)
            elif any(x in city_lower for x in ["france","paris","germany","berlin","spain","madrid","barcelona","rome","italy","amsterdam","netherlands","sweden","stockholm","vienna","austria","zurich","switzerland","brussels","belgium","lisbon","portugal","warsaw","poland","prague","czech","milan"]):
                currency = "EUR"
                price = round(random.randint(min_p, max_p) * 0.92)
            elif any(x in city_lower for x in ["canada","toronto","vancouver","montreal","calgary"]):
                currency = "CAD"
                price = round(random.randint(min_p, max_p) * 1.36)
            elif any(x in city_lower for x in ["australia","sydney","melbourne","brisbane"]):
                currency = "AUD"
                price = round(random.randint(min_p, max_p) * 1.54)
            elif any(x in city_lower for x in ["brazil","são paulo","rio"]):
                currency = "BRL"
                price = round(random.randint(min_p, max_p) * 5.0)
            elif any(x in city_lower for x in ["mexico","guadalajara","monterrey"]):
                currency = "MXN"
                price = round(random.randint(min_p, max_p) * 18)
            elif any(x in city_lower for x in ["india","mumbai","delhi","bangalore"]):
                currency = "INR"
                price = round(random.randint(min_p, max_p) * 83)
            elif any(x in city_lower for x in ["switzerland","zurich"]):
                currency = "CHF"
                price = round(random.randint(min_p, max_p) * 0.90)
            else:
                currency = "USD"
                price = round(random.randint(min_p, max_p))

            want = {
                "id": idx + 1,
                "title": title,
                "description": desc,
                "category": cat,
                "maxPrice": price,
                "currency": currency,
                "location": city,
                "authorName": author,
                "status": statuses[idx],
                "createdAt": rdate(90),
            }
            wants.append(want)
            idx += 1

    return wants


def nearby_city(city):
    mapping = {
        "New York, NY": ["Brooklyn, NY", "Newark, NJ", "Jersey City, NJ", "Hoboken, NJ"],
        "Los Angeles, CA": ["Pasadena, CA", "Long Beach, CA", "Santa Monica, CA", "Glendale, CA"],
        "Chicago, IL": ["Evanston, IL", "Oak Park, IL", "Naperville, IL", "Schaumburg, IL"],
        "Houston, TX": ["Sugar Land, TX", "Pearland, TX", "The Woodlands, TX"],
        "London, UK": ["Croydon, UK", "Bromley, UK", "Watford, UK", "Reading, UK"],
        "Paris, France": ["Versailles, France", "Saint-Denis, France", "Boulogne, France"],
        "Berlin, Germany": ["Potsdam, Germany", "Brandenburg, Germany", "Wolfsburg, Germany"],
        "Tokyo, Japan": ["Yokohama, Japan", "Kawasaki, Japan", "Chiba, Japan", "Saitama, Japan"],
        "Seoul, South Korea": ["Incheon, South Korea", "Suwon, South Korea", "Seongnam, South Korea"],
        "São Paulo, Brazil": ["Guarulhos, Brazil", "Campinas, Brazil", "Santo André, Brazil"],
        "Mexico City, Mexico": ["Guadalajara, Mexico", "Ecatepec, Mexico", "Tlalnepantla, Mexico"],
        "Sydney, Australia": ["Parramatta, Australia", "Newcastle, Australia", "Wollongong, Australia"],
        "Toronto, Canada": ["Mississauga, Canada", "Brampton, Canada", "Markham, Canada"],
        "Mumbai, India": ["Thane, India", "Navi Mumbai, India", "Pune, India"],
        "Beijing, China": ["Tianjin, China", "Baoding, China", "Langfang, China"],
        "Dubai, UAE": ["Abu Dhabi, UAE", "Sharjah, UAE", "Ajman, UAE"],
        "Buenos Aires, Argentina": ["La Plata, Argentina", "Mar del Plata, Argentina", "Rosario, Argentina"],
        "Istanbul, Turkey": ["Ankara, Turkey", "Bursa, Turkey", "Izmir, Turkey"],
    }
    for key in mapping:
        if key in city:
            return random.choice(mapping[key])
    # fallback: same city
    return city

def offerer_name_for_location(city):
    # reuse pick_location to get a name from the same region
    # simple approach: return a name from the same pool
    for pool, _ in all_location_pools:
        for loc in pool:
            if loc[0] == city:
                return random.choice(loc[1])
    # fallback
    _, name = pick_location()
    return name


def build_offers(wants):
    offers = []
    # Select wants to get offers — some get 0, some get 1-3
    # 300 offers across ~200 wants on average
    want_ids = [w["id"] for w in wants]
    
    # Assign offer counts
    offer_counts = {}
    n_with_offers = 220
    chosen = random.sample(want_ids, n_with_offers)
    for wid in chosen:
        offer_counts[wid] = 1
    # Give some 2 offers and some 3
    extra2 = random.sample(chosen, 60)
    for wid in extra2:
        offer_counts[wid] += 1
    extra3 = random.sample(extra2, 20)
    for wid in extra3:
        offer_counts[wid] += 1

    # Flatten to list of want_ids for offers
    offer_want_ids = []
    for wid, cnt in offer_counts.items():
        offer_want_ids.extend([wid] * cnt)
    random.shuffle(offer_want_ids)
    # Trim to exactly 300
    offer_want_ids = offer_want_ids[:300]

    statuses = ["pending"] * 200 + ["accepted"] * 70 + ["declined"] * 30
    random.shuffle(statuses)

    # Build want lookup
    want_map = {w["id"]: w for w in wants}

    offer_messages = {
        "electronics": [
            "Hi, I have exactly what you're looking for! The unit is in excellent condition with all original accessories.",
            "I can offer mine — barely used, still under warranty, all original packaging included.",
            "Available now. Tested fully functional. Can ship or meet locally.",
            "Just upgraded to a newer model, selling mine in immaculate condition.",
            "Great condition, only used for 3 months. Includes original box and receipt.",
        ],
        "furniture": [
            "Still in great shape — minor scuff on one leg but otherwise perfect. Can disassemble for transport.",
            "Moving next week so motivated to sell. Clean, from a pet-free smoke-free home.",
            "This piece is exactly as described. Happy to send more photos.",
            "Just reupholstered last year. Dimensions match what you're looking for.",
            "Purchased from the retailer 18 months ago. Original receipt available.",
        ],
        "vehicles": [
            "One owner, full service history at the dealership. Never modified.",
            "Pristine condition, 100% original. All paperwork in order.",
            "Had it inspected last month — everything in order. Happy to allow a pre-purchase inspection.",
            "Garage kept, no accidents. Available for test drive this weekend.",
            "Selling due to relocation. Clean title, all documentation available.",
        ],
        "auto-parts": [
            "Pulled this from a numbers-matching car. Photos available on request.",
            "New old stock found in my grandfather's garage. Never installed.",
            "Sourced from a well-known barn find. Provenance documented.",
            "Professionally media-blasted and primed. Ready to paint.",
            "This is the correct part for your application — can verify fitment.",
        ],
        "collectibles": [
            "Authenticated by a professional grader. Certificate available.",
            "From my personal collection, acquired 20 years ago. Provenance documented.",
            "Excellent condition, stored in acid-free materials since acquisition.",
            "This is the genuine article — happy to provide additional provenance.",
            "Graded copy ready for transfer. Case shows no damage.",
        ],
        "services": [
            "I'm available and experienced in exactly this type of work. References on request.",
            "Licensed, insured, and available as soon as next week.",
            "Happy to provide a free consultation and quote. My last 10 clients all left 5-star reviews.",
            "This is my specialty — can start immediately and guarantee the work.",
            "Portfolio available at my website. Fully certified and insured.",
        ],
        "education": [
            "I have the complete set in excellent condition — minimal highlighting.",
            "These materials helped me pass the exam on my first attempt.",
            "Access codes still valid — tested yesterday. Happy to screenshot proof.",
            "Complete set with all volumes. Notes are my own and may help.",
            "Current edition, purchased 4 months ago. All sections intact.",
        ],
        "clothing": [
            "Worn twice, in pristine condition. Tags still attached.",
            "This is 100% authentic — receipt and authentication card included.",
            "Perfect condition, from a smoke-free pet-free home.",
            "All original packaging, purchased from the brand directly.",
            "Fits as described. Happy to provide measurements before purchase.",
        ],
        "food": [
            "Fresh from the source — can deliver same day or tomorrow.",
            "All food safety certifications current. References from previous clients.",
            "Organic and locally sourced. Happy to provide certificate of origin.",
            "Available for a tasting before commitment. Schedule at your convenience.",
            "Delivery available. All ingredients are certified and labeled.",
        ],
        "sports": [
            "Lightly used, in excellent shape. All original components included.",
            "Professional grade — used by a certified coach for demos only.",
            "Tickets are official — Ticketmaster transfer, no issues.",
            "Equipment in excellent condition — serviced before listing.",
            "Used for one season only. Clean and ready to use.",
        ],
        "tools": [
            "Barely used — bought for a project that never started.",
            "All functions verified before listing. Includes original case and bits.",
            "Professional grade, well maintained. Maintenance log available.",
            "Upgraded to a newer model. This one is in excellent shape.",
            "Can demonstrate operation before sale. All guards and safety features intact.",
        ],
        "music": [
            "This instrument has been professionally set up and plays beautifully.",
            "From a non-smoking home studio. Used for recording only, never gigged.",
            "Original case included, all hardware present. Happy to do a video demo.",
            "Recently serviced by a certified technician. All electronics inspected.",
            "Matching serial number to the case card. Completely original.",
        ],
        "books": [
            "This copy is in excellent condition — careful reader, no marks.",
            "From a private library — kept in climate-controlled storage.",
            "Provenance documented. Previous owner was a collector.",
            "Matching the description exactly — happy to provide photos of all pages.",
            "Complete and intact. All plates and endpapers present.",
        ],
        "pets": [
            "Experienced pet sitter — 10+ years, insured, and first aid certified.",
            "Fresh stock, within expiry date. From a reputable supplier.",
            "Licensed breeder with health certificates for all breeding stock.",
            "Gently used, from a single-pet home. Clean and odor free.",
            "Happy to provide references from previous pet care clients.",
        ],
        "health": [
            "Barely used — doctor changed my prescription. All components present.",
            "Certified instructor with 8 years of experience. Testimonials available.",
            "Equipment under 1 year old. All calibration certificates included.",
            "Clean from a non-smoking home. All accessories included.",
            "Fully functional — happy to video call for a demonstration.",
        ],
        "crafts": [
            "Machine serviced 6 months ago. All attachments and feet included.",
            "Used for one project. Everything works perfectly.",
            "From a professional crafter. All accessories and original box included.",
            "Complete kit with all tools and materials. Nothing missing.",
            "Excellent condition — traded up to a larger model.",
        ],
        "garden": [
            "Well maintained — serviced at the end of last season.",
            "Used for 2 seasons. All blades sharpened and fluids changed.",
            "From a downsizing household. Everything works as expected.",
            "Professional grade — used by a landscaping company for one season.",
            "All seeds are dated from the current year. High germination rate.",
        ],
        "real-estate": [
            "Available from next month. Clean title, flexible on terms.",
            "Great location, easy access. Willing to negotiate on the monthly rate.",
            "Ideal for your stated needs. Can arrange a viewing this week.",
            "Flexible on lease length. Utilities can be included in the price.",
            "Well-maintained space with 24/7 access. References required.",
        ],
        "other": [
            "Excellent condition — stored in climate-controlled environment.",
            "Barely used, all original accessories included.",
            "Happy to provide additional photos or a video walkthrough.",
            "From a pet-free, smoke-free home. Ready for immediate pickup.",
            "Original receipt and documentation available. Price is negotiable.",
        ],
    }

    for i, wid in enumerate(offer_want_ids):
        want = want_map[wid]
        cat = want["category"]
        msgs = offer_messages.get(cat, offer_messages["other"])

        max_p = want["maxPrice"]
        offer_price = round(max_p * random.uniform(0.72, 1.0))

        # Parse want createdAt and add random time after
        want_created = datetime.fromisoformat(want["createdAt"].replace("Z", "+00:00"))
        delta_days = random.randint(0, 30)
        delta_hours = random.randint(0, 23)
        offer_created = want_created + timedelta(days=delta_days, hours=delta_hours)
        # Clamp to now
        now = datetime(2026, 3, 27, 16, 39, 0, tzinfo=timezone.utc)
        if offer_created > now:
            offer_created = now - timedelta(hours=random.randint(1, 48))

        offerer_city = nearby_city(want["location"])
        offerer = offerer_name_for_location(want["location"])

        offer = {
            "id": i + 1,
            "wantId": wid,
            "message": random.choice(msgs),
            "price": offer_price,
            "currency": want["currency"],
            "location": offerer_city,
            "offererName": offerer,
            "status": statuses[i],
            "createdAt": offer_created.isoformat().replace("+00:00", "Z"),
        }
        offers.append(offer)

    return offers


if __name__ == "__main__":
    import os
    os.makedirs("/home/user/workspace/wantd", exist_ok=True)

    print("Building wants...")
    wants = build_wants()
    print(f"  Generated {len(wants)} wants")

    print("Building offers...")
    offers = build_offers(wants)
    print(f"  Generated {len(offers)} offers")

    # Validate
    assert len(wants) == 1000, f"Expected 1000 wants, got {len(wants)}"
    assert len(offers) == 300, f"Expected 300 offers, got {len(offers)}"

    status_counts = {}
    for w in wants:
        status_counts[w["status"]] = status_counts.get(w["status"], 0) + 1
    print(f"  Status distribution: {status_counts}")

    cat_counts = {}
    for w in wants:
        cat_counts[w["category"]] = cat_counts.get(w["category"], 0) + 1
    print(f"  Category distribution: {cat_counts}")

    wants_out = [{k: v for k, v in w.items() if k != "id"} for w in wants]
    # Re-add id as first field
    wants_out = [{"id": w["id"], **{k: v for k, v in w.items() if k != "id"}} for w in wants]

    with open("/home/user/workspace/wantd/seed-data.json", "w", encoding="utf-8") as f:
        json.dump(wants_out, f, ensure_ascii=False, indent=2)

    with open("/home/user/workspace/wantd/seed-offers.json", "w", encoding="utf-8") as f:
        json.dump(offers, f, ensure_ascii=False, indent=2)

    print("Done! Files written to /home/user/workspace/wantd/")
