
        // State Architecture: Separates custom user records from loaded telemetry demo records
        let currentUser = null;
        let isDataStreamLoaded = false;
        let userCustomTrips = [];       // Real user saves
        let loadedTelemetryTrips = [];  // Isolated loaded telemetry data
        let trendChartInstance = null;
        let modeChartInstance = null;
        let homePulseAnimFrame = null;

        // Verified Indian Context Emission Factors Hash Map (kg CO₂e per pkm or vkm)
        const emissionFactorsMap = {
            "Petrol car": 0.19,
            "Diesel car": 0.17,
            "Electric car": 0.05,
            "Petrol motorcycle or scooter": 0.10,
            "Electric two-wheeler": 0.02,
            "Bus": 0.04,
            "Metro or local train": 0.03,
            "Intercity train": 0.02,
            "Auto-rickshaw": 0.09,
            "Bicycle": 0.00,
            "Walking": 0.00
        };

        // Realistic Preloaded Commute Telemetry Data (Hydrated upon clicking "Load Data")
        const defaultCommuteTelemetry = [
            { id: 'telemetry-1', date: '2026-06-01', route: 'Andheri Station → Churchgate', mode: 'Metro or local train', distance: 22, emissions: 0.66, desc: 'Monday Suburban Rail Commute' },
            { id: 'telemetry-2', date: '2026-06-02', route: 'Bandra Kurla Complex → Worli Hub', mode: 'Bus', distance: 14, emissions: 0.56, desc: 'Tuesday Electric BEST Bus' },
            { id: 'telemetry-3', date: '2026-06-03', route: 'Greenway Park → Local Market', mode: 'Walking', distance: 2.5, emissions: 0.00, desc: 'Wednesday Pedestrian Errands' },
            { id: 'telemetry-4', date: '2026-06-04', route: 'Hinjawadi Phase 1 → Baner', mode: 'Electric two-wheeler', distance: 9, emissions: 0.18, desc: 'Thursday E-Scooter Ride' },
            { id: 'telemetry-5', date: '2026-06-05', route: 'Ghatkopar → Versova Metro', mode: 'Metro or local train', distance: 11, emissions: 0.33, desc: 'Friday Metro Commuter Run' },
            { id: 'telemetry-6', date: '2026-06-06', route: 'Riverside Greenway Corridor', mode: 'Bicycle', distance: 6, emissions: 0.00, desc: 'Saturday Zero-Carbon Cycling' },
            { id: 'telemetry-7', date: '2026-06-07', route: 'Powai Hub → BKC Office', mode: 'Electric car', distance: 16, emissions: 0.80, desc: 'Sunday EV Shared Transit' }
        ];

        // Regional Community Area Data & Discussions
        const areaData = {
            mumbai: {
                name: "Mumbai Metropolitan (Central & Western)",
                subtext: "Channel #western-central-rail • Rapid Rail, Metro & BEST Bus",
                onlineCount: 84,
                carbonSaved: "5,280",
                rank: "#1 District",
                messages: [
                    { id: 1, sender: "Rohan Deshmukh", role: "Daily Rail Commuter", time: "10m ago", text: "Suburban train Line 2 has added 4 new air-conditioned rakes today. Peak hour commute was smooth!" },
                    { id: 2, sender: "Priya Sharma", role: "Carpool Leader", time: "7m ago", text: "Leaving Bandra toward BKC at 8:45 AM in my EV. 2 open seats if anyone wants to share the ride!" },
                    { id: 3, sender: "Amit Verma", role: "Cyclist", time: "3m ago", text: "New sheltered bicycle parking installed at Andheri West Station Gate 3. Very secure." }
                ]
            },
            pune: {
                name: "Pune Urban & IT Corridor (Hinjawadi/Baner)",
                subtext: "Channel #it-park-transit • Metro Line 3 & E-Mobility Shuttles",
                onlineCount: 62,
                carbonSaved: "4,190",
                rank: "#2 District",
                messages: [
                    { id: 1, sender: "Saurabh Kulkarni", role: "Software Engineer", time: "22m ago", text: "Hinjawadi Phase 1 to Baner feeder bus is now 100% electric. Huge cut in emissions vs driving solo." },
                    { id: 2, sender: "Ananya Joshi", role: "Carpool Host", time: "11m ago", text: "Daily carpool from Aundh to Hinjawadi Phase 2 departing 9:15 AM. 2 seats open." }
                ]
            },
            bengaluru: {
                name: "Bengaluru Silicon Corridor (Whitefield/ORR)",
                subtext: "Channel #orr-namma-metro • Purple Line & BMTC Feeder",
                onlineCount: 95,
                carbonSaved: "6,120",
                rank: "#3 District",
                messages: [
                    { id: 1, sender: "Vikram Reddy", role: "Tech Commuter", time: "15m ago", text: "Namma Metro Purple Line frequency increased to 3 mins during peak hours. Took 25 mins from Indiranagar to Whitefield." },
                    { id: 2, sender: "Sneha Nair", role: "EV Advocate", time: "8m ago", text: "Charging station at Kadubeesanahalli has 4 fast chargers free right now." }
                ]
            },
            delhincr: {
                name: "Delhi NCR & Gurugram Expressway",
                subtext: "Channel #delhi-metro-rapid • Yellow Line & Cyber City Shuttles",
                onlineCount: 78,
                carbonSaved: "5,450",
                rank: "#4 District",
                messages: [
                    { id: 1, sender: "Manish Gupta", role: "Metro Commuter", time: "30m ago", text: "Delhi Metro Yellow Line running without delays today. AC rakes on full blast." },
                    { id: 2, sender: "Kavita Rao", role: "Resident", time: "12m ago", text: "Carpooling from Sector 56 to DLF Cyber City at 8:30 AM tomorrow. DM me to join." }
                ]
            },
            hyderabad: {
                name: "Hyderabad Cyberabad & Hitec City",
                subtext: "Channel #hitec-metro • Blue Line & Electric Autos",
                onlineCount: 54,
                carbonSaved: "3,890",
                rank: "#5 District",
                messages: [
                    { id: 1, sender: "Karthik Rao", role: "Cyberabad Resident", time: "18m ago", text: "Electric shared autos now available directly outside Raidurg Metro station. Very convenient." },
                    { id: 2, sender: "Farhan Ali", role: "Commuter", time: "5m ago", text: "Looking for cycling partners on Financial District outer ring road this weekend." }
                ]
            }
        };

        let currentActiveAreaKey = 'mumbai';

        // Multilingual Dictionaries (English, Hindi, Marathi, Spanish, French, German)
        const translations = {
            en: {
                tagline_sub: "Transportation Carbon Intelligence",
                nav_home: "Home",
                nav_calculator: "Calculator",
                nav_dashboard: "Dashboard",
                nav_trips: "Trip History",
                nav_recommendations: "Insights",
                nav_community: "Community Chat",
                auth_login: "Sign In",
                top_load_data: "Load Data",
                btn_load_data: "Load Data",
                data_banner_text: "Telemetry Feed Synchronized: Multi-day verified transportation records active. Personal custom saves are kept isolated.",
                data_reset_btn: "Clear Loaded Data",
                hero_badge: "Enterprise Carbon Telemetry Platform",
                hero_title_1: "The Living Pulse of",
                hero_title_2: "Low-Carbon Commuting.",
                hero_desc: "Eco Pulse provides precision transportation carbon telemetry for urban residents and enterprises. Calculate multi-modal commute impact, monitor real-time emission rhythms, connect with regional commuters, and accelerate municipal decarbonization.",
                btn_calculate: "Calculate My Footprint",
                btn_dashboard: "View Live Dashboard",
                preview_view_full: "Open Dashboard Metrics",
                pulse_card_title: "Real-Time Commute Pulse",
                feat_1_title: "Carbon Pulse Engine",
                feat_1_desc: "Accurately compute emissions across 12+ transport modes including local trains, metro, buses, EVs, and auto-rickshaws with passenger occupancy factors.",
                feat_2_title: "Area Commuter Network",
                feat_2_desc: "Connect with neighbors in your specific municipal area to coordinate carpools, share rapid transit updates, and cut collective emissions.",
                feat_3_title: "Enterprise Export & Compliance",
                feat_3_desc: "Export complete journey records to CSV for database audit (SQLite/MySQL schema compliant) with ISO-14064 verifiable emission calculations.",
                steps_heading: "How Eco Pulse Operates",
                steps_sub: "A closed-loop framework for tracking, analyzing, and reducing community transportation emissions.",
                step_1_title: "Telemetry Ingestion",
                step_1_desc: "Input journey parameters, vehicle specifications, distance, and occupancy factors via our high-speed calculator.",
                step_2_title: "Factor Synthesis",
                step_2_desc: "Deterministic emission factors translate passenger-kilometers into accurate, verifiable carbon intensities.",
                step_3_title: "Community Pulse Action",
                step_3_desc: "Execute recommendations and leverage area chat networks to transition single-occupancy commutes into green rides.",
                calc_heading: "Transportation Emission Calculator",
                calc_sub: "Accurately calculate single journey or recurring transit emissions using verified regional factor standards.",
                calc_presets_label: "Quick Transit Presets:",
                label_start_loc: "Origin Location",
                label_end_loc: "Destination",
                label_mode: "Modal Transit Category",
                label_distance: "Distance (Kilometers)",
                label_trips: "Trip Multiplier (e.g. Return = 2)",
                label_passengers: "Vehicle Occupancy (Passengers)",
                label_date: "Journey Date",
                label_desc: "Trip Purpose / Route Notes",
                btn_calc_submit: "Calculate & Save Journey",
                res_heading: "Telemetry Synthesis",
                res_emissions: "Estimated Emissions",
                res_distance: "Total Distance",
                res_factor: "Intensity Factor",
                res_note: "Journey telemetry logged to memory. Open Dashboard to view trends.",
                res_goto_dash: "Open Dashboard",
                dash_heading: "Carbon Pulse Dashboard",
                dash_sub: "Personalized analytics and transportation emission summaries based on active records.",
                dash_add_trip: "Log Journey",
                kpi_total_emissions: "Total Net Emissions",
                kpi_emissions_sub: "Across all logged journeys",
                kpi_total_distance: "Total Travel Distance",
                kpi_distance_sub: "Cumulative commute distance",
                kpi_avg_intensity: "Emission Intensity",
                kpi_intensity_sub: "Efficiency index per km",
                kpi_frequent_mode: "Dominant Mode",
                kpi_mode_sub: "Highest trip frequency",
                goal_heading: "Weekly Carbon Ceiling (Target: 30 kg CO₂e)",
                goal_sub: "Aligned with urban low-carbon mobility limits.",
                chart_trend_title: "Carbon Pulse Trajectory",
                chart_mode_title: "Emissions by Transit Modality",
                trips_heading: "Journey Management & History",
                trips_sub: "Filter, inspect, or manage all logged transportation records.",
                filter_all_modes: "All Transit Modes",
                th_date: "Date",
                th_route: "Route & Description",
                th_mode: "Transit Mode",
                th_distance: "Distance",
                th_emissions: "Emissions",
                th_actions: "Action",
                empty_trips_title: "No journeys recorded yet.",
                empty_trips_desc: "Use the calculator or click 'Load Data' above to instantly populate transit records.",
                rec_heading: "Sustainable Transit Insights",
                rec_sub: "Prioritized modal alternatives ranked by emission mitigation potential and commuting feasibility.",
                comm_heading: "Area Community Chat Group",
                comm_sub: "Connect directly with residents in your local area to coordinate carpools, share transit updates, and cut emissions together.",
                comm_active_neighbors: "Active Neighbors in Region",
                comm_area_savings: "Regional Carbon Avoided",
                comm_zone_rank: "Regional Sustainability Rank",
                footer_rights: "All rights reserved. Enterprise Carbon Telemetry Network.",
                footer_privacy: "Privacy & Telemetry Protocol",
                footer_help: "Documentation",
                footer_contact: "Resident Portal",
                auth_modal_title: "Resident Account Sign In",
                auth_email: "Resident Email",
                auth_pass: "Password",
                auth_submit: "Sign In / Register",
                auth_note: "ISO-27001 encrypted session management with isolated local area tokens.",
                privacy_title: "Privacy & Telemetry Protocol",
                privacy_p1: "Eco Pulse exclusively synthesizes transportation emissions data to promote sustainable transit. Precise route coordinates are obfuscated to protect resident privacy.",
                privacy_p2: "Area chat groups only identify residents by opt-in aliases. Telemetry records loaded into the active session remain within client memory.",
                help_title: "Eco Pulse Documentation",
                help_p1: "Use the calculator to input daily commuting distances across 12+ transport modes. Regional factor hashes map distance to kilograms of CO₂ equivalent.",
                help_p2: "Click 'Load Data' in the top bar, hero section, or dashboard to instantly hydrate multi-day realistic transit records.",
                cmp_badge: "VEHICLE EMISSION BENCHMARK",
                cmp_heading: "Vehicle-Wise Carbon Emission Comparison",
                cmp_sub: "Calculate and compare estimated greenhouse gas emissions across 7 transportation modes for any specific journey distance. Discover the lowest-carbon way to travel.",
                cmp_params_title: "Journey Parameters",
                cmp_label_origin: "Origin / Starting Place",
                cmp_label_dest: "Destination",
                cmp_label_dist: "Travel Distance (km)",
                cmp_label_pax: "Vehicle Occupancy",
                cmp_presets_label: "Quick Corridors:",
                cmp_th_vehicle: "Vehicle Type",
                cmp_th_dist: "Travel Distance (km)",
                cmp_th_emissions: "Estimated CO₂ Emissions (kg CO₂e)",
                cmp_th_pax: "Emissions per Passenger",
                cmp_th_impact: "Relative Environmental Impact",
                cmp_th_action: "Action",
                cmp_doc_title: "Calculation Formula, Emission Factors & Documentation",
                cmp_disclaimer: "<strong>Note on Estimation Accuracy:</strong> These calculations are verified scientific estimates and are not presented as exact point measurements. Actual emissions generated will vary depending on vehicle curb weight, driving speed, severe traffic congestion, auxiliary air conditioning load, terrain elevation profile, local electricity grid generation mix, and exact passenger loading."
            },
            hi: {
                tagline_sub: "परिवहन कार्बन इंटेलिजेंस",
                nav_home: "होम",
                nav_calculator: "कैलकुलेटर",
                nav_dashboard: "डैशबोर्ड",
                nav_trips: "यात्रा इतिहास",
                nav_recommendations: "सुझाव",
                nav_community: "कम्युनिटी चैट",
                auth_login: "साइन इन",
                top_load_data: "डेटा लोड करें",
                btn_load_data: "डेटा लोड करें",
                data_banner_text: "टेलीमेट्री सक्रिय: बहु-दिवसीय सत्यापित परिवहन रिकॉर्ड सक्रिय हैं।",
                data_reset_btn: "रिकॉर्ड साफ़ करें",
                hero_badge: "सत्यापित एंटरप्राइज कार्बन टेलीमेट्री",
                hero_title_1: "हरित गतिशीलता की जीवंत धड़कन,",
                hero_title_2: "इको पल्स के साथ।",
                hero_desc: "इको पल्स सटीक परिवहन कार्बन टेलीमेट्री प्रदान करता है। अपनी यात्रा के प्रभाव की गणना करें, अपने इलाके के साथी यात्रियों से जुड़ें और हरित आवागमन अपनाएं।",
                btn_calculate: "पदचिह्न गणना करें",
                btn_dashboard: "डैशबोर्ड खोलें",
                preview_view_full: "पल्स मेट्रिक्स देखें",
                pulse_card_title: "रीयल-टाइम कम्यूट पल्स",
                feat_1_title: "कार्बन पल्स इंजन",
                feat_1_desc: "लोकल ट्रेन, मेट्रो, बसों और ईवी सहित 12+ परिवहन साधनों का सटीक गणितीय विश्लेषण।",
                feat_2_title: "इलाका कम्यूटर नेटवर्क",
                feat_2_desc: "कारपूलिंग और साझा यात्रा के लिए अपने क्षेत्र के लोगों से सीधे चैट करें।",
                feat_3_title: "डेटा एक्सपोर्ट और अनुपालन",
                feat_3_desc: "सत्यापित गणनाओं के साथ डेटाबेस ऑडिट (SQLite/MySQL) के लिए CSV में यात्रा रिकॉर्ड निर्यात करें।",
                steps_heading: "इको पल्स कैसे कार्य करता है",
                steps_sub: "सामुदायिक परिवहन उत्सर्जन को ट्रैक और कम करने का सरल ढांचा।",
                step_1_title: "डेटा दर्ज करें",
                step_1_desc: "कैलकुलेटर के माध्यम से दूरी, साधन और यात्रियों की संख्या इनपुट करें।",
                step_2_title: "कारक संश्लेषण",
                step_2_desc: "सटीक क्षेत्रीय कारक तुरंत आपके कार्बन पदचिह्न की गणना करते हैं।",
                step_3_title: "सामुदायिक तालमेल",
                step_3_desc: "एआई सुझावों और इलाका चैट के माध्यम से हरित आवागमन अपनाएं।",
                calc_heading: "परिवहन उत्सर्जन कैलकुलेटर",
                calc_sub: "क्षेत्रीय मानकों का उपयोग करके एकल या आवर्ती यात्रा उत्सर्जन की गणना करें।",
                calc_presets_label: "त्वरित ट्रांजिट प्रीसेट:",
                label_start_loc: "प्रारंभिक स्थान",
                label_end_loc: "गंतव्य स्थान",
                label_mode: "परिवहन का साधन",
                label_distance: "दूरी (किलोमीटर)",
                label_trips: "यात्रा गुणक (जैसे वापसी = 2)",
                label_passengers: "यात्री संख्या",
                label_date: "यात्रा की तिथि",
                label_desc: "यात्रा विवरण / नोट्स",
                btn_calc_submit: "गणना करें और यात्रा सहेजें",
                res_heading: "टेलीमेट्री परिणाम",
                res_emissions: "अनुमानित उत्सर्जन",
                res_distance: "कुल दूरी",
                res_factor: "तीव्रता कारक",
                res_note: "यात्रा दर्ज हो गई है। रुझान देखने के लिए डैशबोर्ड खोलें।",
                res_goto_dash: "डैशबोर्ड खोलें",
                dash_heading: "कार्बन पल्स डैशबोर्ड",
                dash_sub: "आपके सक्रिय रिकॉर्ड पर आधारित व्यक्तिगत कार्बन विश्लेषण।",
                dash_add_trip: "यात्रा जोड़ें",
                kpi_total_emissions: "कुल शुद्ध उत्सर्जन",
                kpi_emissions_sub: "सभी दर्ज यात्राओं में",
                kpi_total_distance: "कुल यात्रा दूरी",
                kpi_distance_sub: "संचयी यात्रा दूरी",
                kpi_avg_intensity: "उत्सर्जन तीव्रता",
                kpi_intensity_sub: "प्रति किमी दक्षता सूचकांक",
                kpi_frequent_mode: "प्रमुख साधन",
                kpi_mode_sub: "सर्वाधिक उपयोग किया गया",
                goal_heading: "साप्ताहिक कार्बन सीमा (लक्ष्य: 30 किग्रा CO₂e)",
                goal_sub: "शहरी हरित गतिशीलता मानकों के अनुरूप।",
                chart_trend_title: "कार्बन पल्स प्रक्षेपवक्र",
                chart_mode_title: "साधन अनुसार उत्सर्जन आवंटन",
                trips_heading: "यात्रा प्रबंधन और इतिहास",
                trips_sub: "अपने सभी परिवहन रिकॉर्ड देखें, फ़िल्टर करें और प्रबंधित करें।",
                filter_all_modes: "सभी परिवहन साधन",
                th_date: "दिनांक",
                th_route: "रूट और विवरण",
                th_mode: "साधन",
                th_distance: "दूरी",
                th_emissions: "उत्सर्जन",
                th_actions: "कार्रवाई",
                empty_trips_title: "अभी तक कोई यात्रा दर्ज नहीं है।",
                empty_trips_desc: "रिकॉर्ड तुरंत भरने के लिए ऊपर 'डेटा लोड करें' पर क्लिक करें या कैलकुलेटर का उपयोग करें।",
                rec_heading: "टिकाऊ यात्रा सिफारिशें",
                rec_sub: "उत्सर्जन कटौती क्षमता के आधार पर प्राथमिकता प्राप्त सुझाव।",
                comm_heading: "इलाका कम्युनिटी चैट ग्रुप",
                comm_sub: "कारपूलिंग और साझा यात्रा के लिए अपने क्षेत्र के लोगों से सीधे चैट करें।",
                comm_active_neighbors: "इलाके में सक्रिय पड़ोसी",
                comm_area_savings: "इलाके में बचा कार्बन",
                comm_zone_rank: "स्वच्छता रैंक",
                footer_rights: "सर्वाधिकार सुरक्षित। व्यावसायिक कार्बन टेलीमेट्री नेटवर्क।",
                footer_privacy: "गोपनीयता नीति",
                footer_help: "दस्तावेज़ीकरण",
                footer_contact: "रेजिडेंट पोर्टल",
                auth_modal_title: "निवासी साइन इन",
                auth_email: "ईमेल पता",
                auth_pass: "पासवर्ड",
                auth_submit: "साइन इन / रजिस्टर",
                auth_note: "सुरक्षित एन्क्रिप्टेड सत्र प्रबंधन।",
                privacy_title: "गोपनीयता नीति",
                privacy_p1: "इको पल्स केवल परिवहन उत्सर्जन पर ध्यान केंद्रित करता है।",
                privacy_p2: "व्यक्तिगत डेटा सुरक्षित रहता है।",
                help_title: "सहायता और दस्तावेज़ीकरण",
                help_p1: "दूरी और मोड इनपुट करने के लिए कैलकुलेटर का उपयोग करें।",
                help_p2: "परीक्षण के लिए 'डेटा लोड करें' पर क्लिक करें।",
                cmp_badge: "वाहन उत्सर्जन बेंचमार्क",
                cmp_heading: "वाहन-वार कार्बन उत्सर्जन तुलना",
                cmp_sub: "किसी भी विशिष्ट यात्रा दूरी के लिए 7 परिवहन साधनों में अनुमानित ग्रीनहाउस गैस उत्सर्जन की गणना और तुलना करें। सबसे कम कार्बन यात्रा विकल्प खोजें।",
                cmp_params_title: "यात्रा पैरामीटर",
                cmp_label_origin: "प्रारंभिक स्थान",
                cmp_label_dest: "गंतव्य स्थान",
                cmp_label_dist: "यात्रा दूरी (किमी)",
                cmp_label_pax: "वाहन में यात्री",
                cmp_presets_label: "त्वरित कॉरिडोर:",
                cmp_th_vehicle: "वाहन प्रकार",
                cmp_th_dist: "यात्रा दूरी (किमी)",
                cmp_th_emissions: "अनुमानित CO₂ उत्सर्जन (किग्रा CO₂e)",
                cmp_th_pax: "प्रति यात्री उत्सर्जन",
                cmp_th_impact: "पर्यावरणीय प्रभाव",
                cmp_th_action: "कार्रवाई",
                cmp_doc_title: "गणना सूत्र, उत्सर्जन कारक और दस्तावेज़ीकरण",
                cmp_disclaimer: "<strong>अनुमान सटीकता पर नोट:</strong> ये गणनाएं सत्यापित वैज्ञानिक अनुमान हैं और सटीक बिंदु माप के रूप में प्रस्तुत नहीं की जाती हैं। वास्तविक उत्सर्जन वाहन के वजन, गति, ट्रैफिक, एयर कंडीशनिंग, इलाके और वास्तविक यात्रियों की संख्या पर निर्भर करता है।"
            },
            mr: {
                tagline_sub: "वाहतूक कार्बन इंटेलिजन्स",
                nav_home: "मुख्यपृष्ठ",
                nav_calculator: "कॅल्क्युलेटर",
                nav_dashboard: "डॅशबोर्ड",
                nav_trips: "प्रवास इतिहास",
                nav_recommendations: "शिफारसी",
                nav_community: "कम्युनिटी चॅट",
                auth_login: "साइन इन",
                top_load_data: "डेटा लोड करा",
                btn_load_data: "डेटा लोड करा",
                data_banner_text: "टेलिमेट्री सक्रिय: बहु-दिवसीय वाहतूक रेकॉर्ड सक्रिय आहेत.",
                data_reset_btn: "रेकॉर्ड साफ करा",
                hero_badge: "थेट कार्बन टेलिमेट्री प्लॅटफॉर्म",
                hero_title_1: "शून्य-उत्सर्जन प्रवासाची गती,",
                hero_title_2: "इको पल्स सोबत.",
                hero_desc: "इको पल्स अचूक वाहतूक कार्बन टेलिमेट्री प्रदान करते. आपल्या दैनंदिन प्रवासाचे विश्लेषण करा, परिसरातील रहिवाशांशी जोडून घ्या आणि हरित प्रवास सुरू करा.",
                btn_calculate: "फूटप्रिंट मोजा",
                btn_dashboard: "डॅशबोर्ड उघडा",
                preview_view_full: "पल्स आकडेवारी पहा",
                pulse_card_title: "रिअल-टाइम कम्यूट पल्स",
                feat_1_title: "कार्बन पल्स इंजिन",
                feat_1_desc: "१२+ वाहतूक पद्धतींचे अचूक गणितीय विश्लेषण आणि उत्सर्जन मोजणी.",
                feat_2_title: "परिसर कम्यूटर नेटवर्क",
                feat_2_desc: "कारपूलिंग आणि लोकल ट्रेनच्या माहितीसाठी आपल्या परिसरातील लोकांशी थेट चॅट करा.",
                feat_3_title: "डेटा एक्सपोर्ट आणि अनुपालन",
                feat_3_desc: "डेटाबेस ऑडिट (SQLite/MySQL) साठी संपूर्ण प्रवासाचे रेकॉर्ड CSV मध्ये डाउनलोड करा.",
                steps_heading: "इको पल्स कसे कार्य करते",
                steps_sub: "वाहतूक उत्सर्जन ट्रॅक आणि कमी करण्यासाठी सोपी रचना.",
                step_1_title: "डेटा नोंदवा",
                step_1_desc: "कॅल्क्युलेटरद्वारे अंतर आणि वाहतुकीचे साधन इनपुट करा.",
                step_2_title: "घटक विश्लेषण",
                step_2_desc: "प्रादेशिक घटकांद्वारे अचूक कार्बन तीव्रतेची गणना करा.",
                step_3_title: "सामुदायिक कृती",
                step_3_desc: "परिसर चॅट आणि एआयच्या मदतीने हरित प्रवासाकडे वळा.",
                calc_heading: "वाहतूक उत्सर्जन कॅल्क्युलेटर",
                calc_sub: "पारदर्शक घटकांचा वापर करून प्रवासाचे उत्सर्जन मोजा.",
                calc_presets_label: "जलद प्रीसेट:",
                label_start_loc: "सुरुवातीचे ठिकाण",
                label_end_loc: "गंतव्यस्थान",
                label_mode: "वाहतूक साधन",
                label_distance: "अंतर (किमी)",
                label_trips: "फेऱ्यांची संख्या",
                label_passengers: "प्रवासी संख्या",
                label_date: "प्रवासाची तारीख",
                label_desc: "प्रवास वर्णन / टीप",
                btn_calc_submit: "गणना करा आणि जतन करा",
                res_heading: "टेलिमेट्री निकाल",
                res_emissions: "अंदाजे उत्सर्जन",
                res_distance: "एकूण अंतर",
                res_factor: "तीव्रता घटक",
                res_note: "प्रवास नोंदवला गेला आहे. डॅशबोर्डवर आलेख तपासा.",
                res_goto_dash: "डॅशबोर्ड उघडा",
                dash_heading: "कार्बन पल्स डॅशबोर्ड",
                dash_sub: "तुमच्या नोंदींवर आधारित वैयक्तिक वाहतूक विश्लेषण.",
                dash_add_trip: "प्रवास जोडा",
                kpi_total_emissions: "एकूण उत्सर्जन",
                kpi_emissions_sub: "सर्व नोंदवलेल्या प्रवासात",
                kpi_total_distance: "एकूण प्रवास अंतर",
                kpi_distance_sub: "एकत्रित अंतर",
                kpi_avg_intensity: "उत्सर्जन तीव्रता",
                kpi_intensity_sub: "प्रति किमी कार्यक्षमता",
                kpi_frequent_mode: "प्रमुख साधन",
                kpi_mode_sub: "सर्वाधिक वापरलेले साधन",
                goal_heading: "साप्ताहिक मर्यादा (लक्ष्य: ३० किलो CO₂e)",
                goal_sub: "शाश्वत नागरी उद्दिष्टांशी सुसंगत.",
                chart_trend_title: "कार्बन पल्स आलेख",
                chart_mode_title: "साधनानुसार उत्सर्जन",
                trips_heading: "प्रवास व्यवस्थापन आणि इतिहास",
                trips_sub: "सर्व वाहतूक नोंदी तपासा आणि व्यवस्थापित करा.",
                filter_all_modes: "सर्व वाहतूक प्रकार",
                th_date: "दिनांक",
                th_route: "मार्ग व वर्णन",
                th_mode: "साधन",
                th_distance: "अंतर",
                th_emissions: "उत्सर्जन",
                th_actions: "कृती",
                empty_trips_title: "अद्याप कोणतीही नोंद नाही.",
                empty_trips_desc: "नोंदी भरण्यासाठी वर 'डेटा लोड करा' वर क्लिक करा.",
                rec_heading: "शाश्वत प्रवास शिफारसी",
                rec_sub: "बचत क्षमतेनुसार शिफारसी.",
                comm_heading: "परिसर कम्युनिटी चॅट ग्रुप",
                comm_sub: "आपल्या परिसरातील लोकांसोबत कारपूलिंगसाठी संवाद साधा.",
                comm_active_neighbors: "परिसरातील सक्रिय सदस्य",
                comm_area_savings: "परिसरात वाचवलेला कार्बन",
                comm_zone_rank: "स्वच्छता रँक",
                footer_rights: "सर्व हक्क राखीव. व्यावसायिक कार्बन टेलिमेट्री.",
                footer_privacy: "गोपनीयता धोरण",
                footer_help: "दस्तऐवजीकरण",
                footer_contact: "रेसिडेंट पोर्टल",
                auth_modal_title: "निवासी साइन इन",
                auth_email: "ईमेल पत्ता",
                auth_pass: "पासवर्ड",
                auth_submit: "साइन इन / नोंदणी",
                auth_note: "सुरक्षित सत्र व्यवस्थापन.",
                privacy_title: "गोपनीयता धोरण",
                privacy_p1: "इको पल्स केवळ वाहतूक कार्बनवर लक्ष केंद्रित करते.",
                privacy_p2: "वैयक्तिक तपशील सुरक्षित राहतात.",
                help_title: "मदत आणि दस्तऐवजीकरण",
                help_p1: "प्रवास मोजण्यासाठी कॅल्क्युलेटर वापरा.",
                help_p2: "नमुन्यासाठी 'डेटा लोड करा' वर क्लिक करा.",
                cmp_badge: "वाहन उत्सर्जन बेंचमार्क",
                cmp_heading: "वाहननिहाय कार्बन उत्सर्जन तुलना",
                cmp_sub: "कोणत्याही विशिष्ट प्रवासाच्या अंतरासाठी ७ वाहतूक साधनांमधील अंदाजे हरितगृह वायू उत्सर्जनाची गणना आणि तुलना करा. कमीत कमी कार्बन प्रवासाचा मार्ग शोधा.",
                cmp_params_title: "प्रवास मापदंड",
                cmp_label_origin: "सुरुवातीचे ठिकाण",
                cmp_label_dest: "गंतव्यस्थान",
                cmp_label_dist: "प्रवास अंतर (किमी)",
                cmp_label_pax: "प्रवासी संख्या",
                cmp_presets_label: "जलद कॉरिडॉर:",
                cmp_th_vehicle: "वाहन प्रकार",
                cmp_th_dist: "प्रवास अंतर (किमी)",
                cmp_th_emissions: "अंदाजे CO₂ उत्सर्जन (किग्रॅ CO₂e)",
                cmp_th_pax: "प्रति प्रवासी उत्सर्जन",
                cmp_th_impact: "पर्यावरणीय प्रभाव",
                cmp_th_action: "कृती",
                cmp_doc_title: "गणना सूत्र, उत्सर्जन घटक आणि दस्तऐवजीकरण",
                cmp_disclaimer: "<strong>अंदाज अचूकतेवर टीप:</strong> ही आकडेमोड वैज्ञानिक अंदाजांवर आधारित आहे. प्रत्यक्ष उत्सर्जन वाहनाचे वजन, वेग, वाहतूक कोंडी, एसी वापर, रस्ता आणि प्रवासी संख्येनुसार बदलू शकते."
            },
            es: {
                tagline_sub: "Inteligencia de Carbono en Transporte",
                nav_home: "Inicio",
                nav_calculator: "Calculadora",
                nav_dashboard: "Panel",
                nav_trips: "Historial",
                nav_recommendations: "Ideas",
                nav_community: "Chat Vecinal",
                auth_login: "Iniciar Sesión",
                top_load_data: "Cargar Datos",
                btn_load_data: "Cargar Datos",
                data_banner_text: "Flujo de telemetría sincronizado: registros de transporte activos.",
                data_reset_btn: "Borrar Datos",
                hero_badge: "Plataforma de Telemetría de Carbono",
                hero_title_1: "El Pulso Vivo de la",
                hero_title_2: "Movilidad Sostenible.",
                hero_desc: "Eco Pulse ofrece inteligencia de emisiones de transporte. Calcule el impacto de sus viajes y acelere la descarbonización.",
                btn_calculate: "Calcular Huella",
                btn_dashboard: "Ver Panel",
                preview_view_full: "Ver Métricas",
                pulse_card_title: "Pulso de Movilidad en Vivo",
                feat_1_title: "Motor de Telemetría",
                feat_1_desc: "Análisis matemático de viajes en 12+ modos verificados con factores regionales.",
                feat_2_title: "Red Vecinal",
                feat_2_desc: "Conéctese con vecinos de su distrito para viajes compartidos y alertas de metro.",
                feat_3_title: "Exportación y Cumplimiento",
                feat_3_desc: "Exporte registros a CSV para auditorías de bases de datos (SQLite/MySQL).",
                steps_heading: "Cómo Opera Eco Pulse",
                steps_sub: "Un marco integral para rastrear y reducir emisiones de transporte.",
                step_1_title: "Registro de Viajes",
                step_1_desc: "Ingrese distancia, modo y ocupación mediante la calculadora.",
                step_2_title: "Síntesis de Factores",
                step_2_desc: "Cálculo instantáneo de kilogramos de CO₂e según normas oficiales.",
                step_3_title: "Acción Comunitaria",
                step_3_desc: "Use el chat vecinal para coordinar viajes sustentables.",
                calc_heading: "Calculadora de Emisiones de Transporte",
                calc_sub: "Calcule emisiones de viajes individuales o recurrentes.",
                calc_presets_label: "Rutas Predefinidas:",
                label_start_loc: "Ubicación de Origen",
                label_end_loc: "Destino",
                label_mode: "Medio de Transporte",
                label_distance: "Distancia (km)",
                label_trips: "Multiplicador de Viajes",
                label_passengers: "Pasajeros",
                label_date: "Fecha",
                label_desc: "Notas del Viaje",
                btn_calc_submit: "Calcular y Guardar",
                res_heading: "Síntesis de Telemetría",
                res_emissions: "Emisiones Estimadas",
                res_distance: "Distancia Total",
                res_factor: "Factor de Intensidad",
                res_note: "Viaje registrado con éxito.",
                res_goto_dash: "Ir al Panel",
                dash_heading: "Panel Eco Pulse",
                dash_sub: "Analítica personalizada de emisiones de transporte.",
                dash_add_trip: "Registrar Viaje",
                kpi_total_emissions: "Emisiones Totales",
                kpi_emissions_sub: "En todos los viajes",
                kpi_total_distance: "Distancia Recorrida",
                kpi_distance_sub: "Distancia acumulada",
                kpi_avg_intensity: "Intensidad Media",
                kpi_intensity_sub: "Eficiencia por km",
                kpi_frequent_mode: "Modo Principal",
                kpi_mode_sub: "Mayor frecuencia",
                goal_heading: "Límite Semanal (Objetivo: 30 kg CO₂e)",
                goal_sub: "Alineado con metas urbanas bajas en carbono.",
                chart_trend_title: "Trayectoria de Carbono",
                chart_mode_title: "Emisiones por Medio",
                trips_heading: "Historial de Viajes",
                trips_sub: "Administre y filtre sus viajes registrados.",
                filter_all_modes: "Todos los Medios",
                th_date: "Fecha",
                th_route: "Ruta y Descripción",
                th_mode: "Modo",
                th_distance: "Distancia",
                th_emissions: "Emisiones",
                th_actions: "Acción",
                empty_trips_title: "Sin registros activos.",
                empty_trips_desc: "Haga clic en 'Cargar Datos' para probar con datos reales.",
                rec_heading: "Recomendaciones Sustentables",
                rec_sub: "Sugerencias ordenadas por potencial de ahorro de CO₂e.",
                comm_heading: "Chat Comunitario de Vecinos",
                comm_sub: "Hable con vecinos de su zona para compartir auto y rutas.",
                comm_active_neighbors: "Vecinos Activos",
                comm_area_savings: "CO₂ Evitado en la Zona",
                comm_zone_rank: "Puesto Limpio",
                footer_rights: "Todos los derechos reservados. Red Eco Pulse.",
                footer_privacy: "Privacidad",
                footer_help: "Documentación",
                footer_contact: "Portal Vecinal",
                auth_modal_title: "Acceso Vecinal",
                auth_email: "Correo Electrónico",
                auth_pass: "Contraseña",
                auth_submit: "Ingresar / Registrar",
                auth_note: "Sesión cifrada.",
                privacy_title: "Aviso de Privacidad",
                privacy_p1: "Eco Pulse prioriza la privacidad del viajero.",
                privacy_p2: "Datos locales protegidos.",
                help_title: "Ayuda y Documentación",
                help_p1: "Use la calculadora para computar trayectos.",
                help_p2: "Presione 'Cargar Datos' para iniciar rápidamente.",
                cmp_badge: "BENCHMARK DE EMISIONES",
                cmp_heading: "Comparación de Emisiones de Carbono por Vehículo",
                cmp_sub: "Calcule y compare las emisiones estimadas de gases de efecto invernadero en 7 modos de transporte para cualquier distancia de viaje. Descubra la forma más limpia de desplazarse.",
                cmp_params_title: "Parámetros del Viaje",
                cmp_label_origin: "Lugar de Origen",
                cmp_label_dest: "Destino",
                cmp_label_dist: "Distancia de Viaje (km)",
                cmp_label_pax: "Ocupación del Vehículo",
                cmp_presets_label: "Rutas Rápidas:",
                cmp_th_vehicle: "Tipo de Vehículo",
                cmp_th_dist: "Distancia (km)",
                cmp_th_emissions: "Emisiones Estimadas (kg CO₂e)",
                cmp_th_pax: "Emisiones por Pasajero",
                cmp_th_impact: "Impacto Ambiental Relativo",
                cmp_th_action: "Acción",
                cmp_doc_title: "Fórmula de Cálculo, Factores de Emisión y Documentación",
                cmp_disclaimer: "<strong>Nota sobre precisión:</strong> Estas cifras son estimaciones calculadas y no medidas exactas. Las emisiones reales varían según el peso del vehículo, velocidad, tráfico, aire acondicionado y ocupantes."
            },
            fr: {
                tagline_sub: "Intelligence Carbone des Transports",
                nav_home: "Accueil",
                nav_calculator: "Calculateur",
                nav_dashboard: "Tableau de Bord",
                nav_trips: "Historique",
                nav_recommendations: "Conseils",
                nav_community: "Chat Quartier",
                auth_login: "Connexion",
                top_load_data: "Charger les Données",
                btn_load_data: "Charger les Données",
                data_banner_text: "Flux télémétrique synchronisé : données de transit actives.",
                data_reset_btn: "Effacer les Données",
                hero_badge: "Plateforme Télémétrique Carbone",
                hero_title_1: "Le Pouls Vivant de la",
                hero_title_2: "Mobilité Décarbonée.",
                hero_desc: "Eco Pulse offre une télémétrie de précision sur le carbone lié au transport urbain.",
                btn_calculate: "Calculer Empreinte",
                btn_dashboard: "Ouvrir Tableau",
                preview_view_full: "Voir Métriques",
                pulse_card_title: "Pouls Éco en Direct",
                feat_1_title: "Moteur de Télémétrie",
                feat_1_desc: "Analyse des trajets selon 12+ modes de transport avec facteurs régionaux.",
                feat_2_title: "Réseau de Quartier",
                feat_2_desc: "Échangez avec les habitants de votre zone pour covoiturer et prendre le train.",
                feat_3_title: "Export & Conformité",
                feat_3_desc: "Exportez les données en CSV pour les audits de bases de données (SQLite/MySQL).",
                steps_heading: "Fonctionnement d'Eco Pulse",
                steps_sub: "Un cadre pour mesurer et réduire les émissions urbaines.",
                step_1_title: "Enregistrement",
                step_1_desc: "Saisissez distance, mode et passagers.",
                step_2_title: "Calcul Immédiat",
                step_2_desc: "Traduction instantanée en kg équivalent CO₂.",
                step_3_title: "Action Collective",
                step_3_desc: "Coordonnez des trajets partagés avec vos voisins.",
                calc_heading: "Calculateur d'Émissions de Transport",
                calc_sub: "Estimez les émissions de vos trajets quotidiens.",
                calc_presets_label: "Trajets Rapides :",
                label_start_loc: "Point de Départ",
                label_end_loc: "Destination",
                label_mode: "Mode de Transport",
                label_distance: "Distance (km)",
                label_trips: "Nombre de Trajets",
                label_passengers: "Passagers",
                label_date: "Date du Trajet",
                label_desc: "Remarques",
                btn_calc_submit: "Calculer et Enregistrer",
                res_heading: "Résultat Télémétrique",
                res_emissions: "Émissions Estimées",
                res_distance: "Distance Totale",
                res_factor: "Facteur d'Intensité",
                res_note: "Trajet enregistré dans votre historique.",
                res_goto_dash: "Voir Tableau de Bord",
                dash_heading: "Tableau de Bord Eco Pulse",
                dash_sub: "Analytique personnalisée des émissions de transport.",
                dash_add_trip: "Ajouter Trajet",
                kpi_total_emissions: "Émissions Totales",
                kpi_emissions_sub: "Sur tous les trajets",
                kpi_total_distance: "Distance Totale",
                kpi_distance_sub: "Distance cumulée",
                kpi_avg_intensity: "Intensité Moyenne",
                kpi_intensity_sub: "Efficacité par km",
                kpi_frequent_mode: "Mode Principal",
                kpi_mode_sub: "Le plus fréquent",
                goal_heading: "Objectif Hebdomadaire (30 kg CO₂e)",
                goal_sub: "Conforme aux normes de transition écologique.",
                chart_trend_title: "Tendance des Émissions",
                chart_mode_title: "Émissions par Mode",
                trips_heading: "Gestion des Trajets",
                trips_sub: "Recherchez et gérez vos trajets.",
                filter_all_modes: "Tous les Modes",
                th_date: "Date",
                th_route: "Trajet & Notes",
                th_mode: "Mode",
                th_distance: "Distance",
                th_emissions: "Émissions",
                th_actions: "Action",
                empty_trips_title: "Aucun trajet enregistré.",
                empty_trips_desc: "Cliquez sur 'Charger les Données' pour tester le système.",
                rec_heading: "Conseils de Décarbonation",
                rec_sub: "Solutions classées par faisabilité et économies d'émissions.",
                comm_heading: "Chat Communautaire de Quartier",
                comm_sub: "Discutez avec vos voisins pour covoiturer et voyager vert.",
                comm_active_neighbors: "Voisins Actifs",
                comm_area_savings: "CO₂ Évité dans la Zone",
                comm_zone_rank: "Classement Propreté",
                footer_rights: "Tous droits réservés. Eco Pulse Network.",
                footer_privacy: "Confidentialité",
                footer_help: "Documentation",
                footer_contact: "Portail Résident",
                auth_modal_title: "Connexion Résident",
                auth_email: "Adresse Email",
                auth_pass: "Mot de passe",
                auth_submit: "Se Connecter",
                auth_note: "Session sécurisée.",
                privacy_title: "Politique de Confidentialité",
                privacy_p1: "Eco Pulse protège l'anonymat de vos trajets.",
                privacy_p2: "Données locales stockées en sécurité.",
                help_title: "Aide & Documentation",
                help_p1: "Utilisez le calculateur pour vos trajets.",
                help_p2: "Cliquez sur 'Charger les Données' pour commencer.",
                cmp_badge: "RÉFÉRENTIEL D'ÉMISSIONS DE VÉHICULE",
                cmp_heading: "Comparaison des Émissions de Carbone par Véhicule",
                cmp_sub: "Calculez et comparez les émissions estimées de gaz à effet de serre selon 7 modes de transport pour toute distance donnée. Découvrez le mode le plus écologique.",
                cmp_params_title: "Paramètres du Trajet",
                cmp_label_origin: "Point de Départ",
                cmp_label_dest: "Destination",
                cmp_label_dist: "Distance Parcourue (km)",
                cmp_label_pax: "Occupation du Véhicule",
                cmp_presets_label: "Corridors Rapides :",
                cmp_th_vehicle: "Mode de Transport",
                cmp_th_dist: "Distance (km)",
                cmp_th_emissions: "Émissions Estimées (kg CO₂e)",
                cmp_th_pax: "Émissions par Passager",
                cmp_th_impact: "Impact Environnemental Relatif",
                cmp_th_action: "Action",
                cmp_doc_title: "Formule de Calcul, Facteurs d'Émission & Documentation",
                cmp_disclaimer: "<strong>Remarque sur la précision :</strong> Ces calculs sont des estimations scientifiques indicatives. Les émissions réelles varient selon le poids du véhicule, la vitesse, la congestion, la climatisation et le nombre d'occupants."
            },
            de: {
                tagline_sub: "Verkehrs-Emissions-Intelligenz",
                nav_home: "Startseite",
                nav_calculator: "Rechner",
                nav_dashboard: "Dashboard",
                nav_trips: "Fahrthistorie",
                nav_recommendations: "Empfehlungen",
                nav_community: "Gebiets-Chat",
                auth_login: "Anmelden",
                top_load_data: "Daten Laden",
                btn_load_data: "Daten Laden",
                data_banner_text: "Telemetriedaten synchronisiert: Verifizierte Fahrten aktiv.",
                data_reset_btn: "Daten Löschen",
                hero_badge: "Enterprise CO₂-Telemetrie-Plattform",
                hero_title_1: "Der Lebendige Puls",
                hero_title_2: "Nachhaltiger Mobilität.",
                hero_desc: "Eco Pulse liefert präzise CO₂-Berechnungen für urbane Pendler. Finden Sie Fahrgemeinschaften in Ihrem Stadtteil.",
                btn_calculate: "Emissionen Berechnen",
                btn_dashboard: "Dashboard Öffnen",
                preview_view_full: "Metriken Öffnen",
                pulse_card_title: "Live-Mobilitäts-Puls",
                feat_1_title: "Telemetrie-Engine",
                feat_1_desc: "Mathematische Analyse über 12+ Verkehrsträger mit Verifizierungsfaktoren.",
                feat_2_title: "Stadtteil-Netzwerk",
                feat_2_desc: "Tauschen Sie sich mit Nachbarn Ihres Gebiets aus für gemeinsame Fahrten.",
                feat_3_title: "Export & Compliance",
                feat_3_desc: "CSV-Export zur Datenbanküberprüfung (SQLite/MySQL-konform).",
                steps_heading: "Wie Eco Pulse Funktioniert",
                steps_sub: "Drei klare Schritte zur Reduzierung von Pendel-Emissionen.",
                step_1_title: "Fahrten Erfassen",
                step_1_desc: "Strecke, Verkehrsmittel und Passagiere eintragen.",
                step_2_title: "Emissionssynthese",
                step_2_desc: "Automatische Umrechnung in kg CO₂-Äquivalente.",
                step_3_title: "Gemeinsam Handeln",
                step_3_desc: "Fahrgemeinschaften gründen und Bus/Bahn nutzen.",
                calc_heading: "Verkehrs-Emissionsrechner",
                calc_sub: "Berechnen Sie Emissionen für Einzel- oder Pendelstrecken.",
                calc_presets_label: "Schnellauswahl:",
                label_start_loc: "Startort",
                label_end_loc: "Zielort",
                label_mode: "Verkehrsmittel",
                label_distance: "Distanz (km)",
                label_trips: "Anzahl Fahrten",
                label_passengers: "Fahrgäste",
                label_date: "Datum",
                label_desc: "Notizen",
                btn_calc_submit: "Berechnen und Speichern",
                res_heading: "Ergebnis",
                res_emissions: "Geschätzte Emissionen",
                res_distance: "Gesamtdistanz",
                res_factor: "Emissionsfaktor",
                res_note: "Fahrt gespeichert.",
                res_goto_dash: "Zum Dashboard",
                dash_heading: "Eco Pulse Dashboard",
                dash_sub: "Ihre persönliche Mobilitätsanalyse.",
                dash_add_trip: "Fahrt Hinzufügen",
                kpi_total_emissions: "Gesamtemissionen",
                kpi_emissions_sub: "Über alle Fahrten",
                kpi_total_distance: "Gesamtdistanz",
                kpi_distance_sub: "Gefahrene Kilometer",
                kpi_avg_intensity: "Durchschnittsintensität",
                kpi_intensity_sub: "Effizienz pro km",
                kpi_frequent_mode: "Hauptverkehrsmittel",
                kpi_mode_sub: "Am häufigsten genutzt",
                goal_heading: "Wöchentliches CO₂-Limit (30 kg)",
                goal_sub: "Gemäß nachhaltigen Zielen.",
                chart_trend_title: "Emissionsverlauf",
                chart_mode_title: "Emissionen nach Modus",
                trips_heading: "Fahrtenverwaltung",
                trips_sub: "Alle erfassten Fahrten im Überblick.",
                filter_all_modes: "Alle Verkehrsträger",
                th_date: "Datum",
                th_route: "Strecke & Notizen",
                th_mode: "Modus",
                th_distance: "Distanz",
                th_emissions: "Emissionen",
                th_actions: "Aktion",
                empty_trips_title: "Noch keine Fahrten eingetragen.",
                empty_trips_desc: "Klicken Sie auf 'Daten Laden', um Beispieldaten zu aktivieren.",
                rec_heading: "Nachhaltigkeitsempfehlungen",
                rec_sub: "Priorisierte Vorschläge zur CO₂-Einsparung.",
                comm_heading: "Nachbarschafts-Chat",
                comm_sub: "Verbinden Sie sich mit Pendlern aus Ihrem Gebiet.",
                comm_active_neighbors: "Aktive Nachbarn",
                comm_area_savings: "Eingespartes CO₂ im Gebiet",
                comm_zone_rank: "Stadtteil-Rang",
                footer_rights: "Alle Rechte vorbehalten. Eco Pulse.",
                footer_privacy: "Datenschutz",
                footer_help: "Hilfe",
                footer_contact: "Portal",
                auth_modal_title: "Anmeldung",
                auth_email: "E-Mail-Adresse",
                auth_pass: "Passwort",
                auth_submit: "Anmelden / Registrieren",
                auth_note: "Sichere Verschlüsselung.",
                privacy_title: "Datenschutzhinweis",
                privacy_p1: "Eco Pulse schützt Ihre Reisedaten.",
                privacy_p2: "Keine Weitergabe sensibler Ortsdaten.",
                help_title: "Hilfe & Dokumentation",
                help_p1: "Nutzen Sie den Rechner für Ihre Fahrten.",
                help_p2: "Wählen Sie 'Daten Laden' für einen Schnelltest.",
                cmp_badge: "FAHRZEUG-EMISSIONS-BENCHMARK",
                cmp_heading: "Fahrzeugbezogener CO₂-Emissionsvergleich",
                cmp_sub: "Berechnen und vergleichen Sie die geschätzten Treibhausgasemissionen von 7 Verkehrsträgern für Ihre gewählte Fahrtstrecke. Entdecken Sie die sauberste Reiseoption.",
                cmp_params_title: "Fahrtparameter",
                cmp_label_origin: "Startort",
                cmp_label_dest: "Zielort",
                cmp_label_dist: "Fahrtstrecke (km)",
                cmp_label_pax: "Fahrzeugbelegung",
                cmp_presets_label: "Schnellauswahl:",
                cmp_th_vehicle: "Fahrzeugtyp",
                cmp_th_dist: "Strecke (km)",
                cmp_th_emissions: "Geschätzte Emissionen (kg CO₂e)",
                cmp_th_pax: "Emissionen pro Passagier",
                cmp_th_impact: "Relative Umweltbelastung",
                cmp_th_action: "Aktion",
                cmp_doc_title: "Berechnungsformel, Emissionsfaktoren & Dokumentation",
                cmp_disclaimer: "<strong>Hinweis zur Schätzgenauigkeit:</strong> Diese Werte sind berechnete Schätzungen und keine exakten Messungen. Reale Emissionen variieren je nach Fahrzeuggewicht, Geschwindigkeit, Stau, Klimaanlage und Passagieranzahl."
            }
        };

        let currentLang = localStorage.getItem('ecopulse_lang') || 'en';

        // Window Initialization
        window.onload = function() {
            lucide.createIcons();
            
            // Language Selection Initialization
            document.getElementById('languageSelect').value = currentLang;
            document.getElementById('languageSelectMobile').value = currentLang;
            applyTranslations(currentLang);
            
            // Set Today's Date in Calculator
            const todayStr = new Date().toISOString().split('T')[0];
            const dateInput = document.getElementById('travelDate');
            if(dateInput) dateInput.value = todayStr;

            // Initialize Pulse Waveform on Hero Canvas with Electric Blue Accent
            initHeroPulseCanvas();

            // Populate Area Community Chat Feed for Default Area
            renderAreaChat(currentActiveAreaKey);

            // Initialize Vehicle-Wise Carbon Emission Comparison Table on Homepage
            initVehicleComparison();

            // Default to Home View
            switchView('home');
        };

        // Language Switcher Functionality
        function changeLanguage(lang) {
            currentLang = lang;
            localStorage.setItem('ecopulse_lang', lang);
            document.getElementById('languageSelect').value = lang;
            document.getElementById('languageSelectMobile').value = lang;
            applyTranslations(lang);
        }

        function applyTranslations(lang) {
            const dict = translations[lang] || translations['en'];
            document.querySelectorAll('[data-i18n]').forEach(el => {
                const key = el.getAttribute('data-i18n');
                if (dict[key]) {
                    el.innerHTML = dict[key];
                }
            });
            if(typeof updateVehicleComparison === 'function') {
                updateVehicleComparison();
            }
        }

        // Header Navigation Switching Function
        function switchView(viewName) {
            const views = ['home', 'calculator', 'dashboard', 'trips', 'recommendations', 'community'];
            views.forEach(v => {
                const el = document.getElementById(`view-${v}`);
                if(el) el.classList.add('hidden');
                const btn = document.getElementById(`nav-${v}`);
                if(btn) {
                    btn.classList.remove('text-navyHeading', 'bg-lightGrey', 'font-extrabold');
                    btn.classList.add('text-mutedSlate');
                }
            });

            const targetView = document.getElementById(`view-${viewName}`);
            if(targetView) targetView.classList.remove('hidden');

            const activeBtn = document.getElementById(`nav-${viewName}`);
            if(activeBtn) {
                activeBtn.classList.remove('text-mutedSlate');
                activeBtn.classList.add('text-navyHeading', 'bg-lightGrey', 'font-bold');
            }

            window.scrollTo({ top: 0, behavior: 'smooth' });

            if(viewName === 'dashboard') {
                updateDashboard();
            } else if(viewName === 'trips') {
                renderTripsTable();
            } else if(viewName === 'recommendations') {
                renderRecommendations();
            } else if(viewName === 'community') {
                renderAreaChat(currentActiveAreaKey);
            }
        }

        function toggleMobileMenu() {
            const menu = document.getElementById('mobileMenu');
            if(menu) menu.classList.toggle('hidden');
        }

        // Living Pulse Waveform Canvas Animation (Professional Blue Theme)
        function initHeroPulseCanvas() {
            const canvas = document.getElementById('homePulseCanvas');
            if(!canvas) return;
            const ctx = canvas.getContext('2d');
            let t = 0;

            function renderPulse() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                const width = canvas.width;
                const height = canvas.height;
                const midY = height / 2;

                // Subtle grid
                ctx.strokeStyle = 'rgba(30, 41, 59, 0.5)';
                ctx.lineWidth = 1;
                ctx.beginPath();
                for(let x = 0; x < width; x += 30) {
                    ctx.moveTo(x, 0); ctx.lineTo(x, height);
                }
                for(let y = 0; y < height; y += 20) {
                    ctx.moveTo(0, y); ctx.lineTo(width, y);
                }
                ctx.stroke();

                // Telemetry pulse waveform line in Electric Corporate Blue
                ctx.strokeStyle = '#2563EB';
                ctx.lineWidth = 2.4;
                ctx.shadowColor = '#38BDF8';
                ctx.shadowBlur = 8;
                ctx.beginPath();

                for(let x = 0; x < width; x++) {
                    const pos = (x + t * 2) % 240;
                    let yOffset = 0;

                    if(pos > 80 && pos < 95) {
                        yOffset = Math.sin((pos - 80) / 15 * Math.PI) * -12; // P wave
                    } else if(pos >= 95 && pos < 105) {
                        yOffset = Math.sin((pos - 95) / 10 * Math.PI) * 8;   // Q dip
                    } else if(pos >= 105 && pos < 120) {
                        yOffset = -Math.sin((pos - 105) / 15 * Math.PI) * 35; // R sharp peak
                    } else if(pos >= 120 && pos < 130) {
                        yOffset = Math.sin((pos - 120) / 10 * Math.PI) * 12; // S dip
                    } else if(pos >= 145 && pos < 175) {
                        yOffset = Math.sin((pos - 145) / 30 * Math.PI) * -16; // T wave
                    } else {
                        yOffset = Math.sin((x + t) * 0.05) * 2;
                    }

                    const y = midY + yOffset;
                    if(x === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.stroke();
                ctx.shadowBlur = 0;

                t += 1.2;
                homePulseAnimFrame = requestAnimationFrame(renderPulse);
            }

            if(homePulseAnimFrame) cancelAnimationFrame(homePulseAnimFrame);
            renderPulse();
        }

        // Quick Transit Preset Applicator
        function applyPreset(startLoc, endLoc, distance, mode, passengers) {
            document.getElementById('startLoc').value = startLoc;
            document.getElementById('endLoc').value = endLoc;
            document.getElementById('distance').value = distance;
            document.getElementById('transportMode').value = mode;
            document.getElementById('passengers').value = passengers;
            document.getElementById('numTrips').value = 1;
            document.getElementById('tripDesc').value = `Preset: ${startLoc} → ${endLoc}`;
        }

        // Calculation Engine with Indian Context Emission Factors
        function handleCalculation(e) {
            e.preventDefault();
            const startLoc = document.getElementById('startLoc').value;
            const endLoc = document.getElementById('endLoc').value;
            const mode = document.getElementById('transportMode').value;
            const distance = parseFloat(document.getElementById('distance').value) || 0;
            const numTrips = parseInt(document.getElementById('numTrips').value) || 1;
            const passengers = parseInt(document.getElementById('passengers').value) || 1;
            const travelDate = document.getElementById('travelDate').value || new Date().toISOString().split('T')[0];
            const desc = document.getElementById('tripDesc').value || `${startLoc} → ${endLoc}`;

            const factor = emissionFactorsMap[mode] !== undefined ? emissionFactorsMap[mode] : 0.08;

            let totalEmissions = 0;
            if(['Bus', 'Metro or local train', 'Intercity train'].includes(mode)) {
                totalEmissions = distance * factor * numTrips;
            } else {
                totalEmissions = (distance * factor * numTrips) / Math.max(1, passengers);
            }
            totalEmissions = parseFloat(totalEmissions.toFixed(2));

            // Display Result Box
            document.getElementById('calculationResultBox').classList.remove('hidden');
            document.getElementById('resModeBadge').innerText = mode;
            document.getElementById('resEmissionsVal').innerHTML = `${totalEmissions} <span class="text-xs font-normal text-slate-400 font-sans">kg CO₂e</span>`;
            document.getElementById('resDistanceVal').innerHTML = `${distance * numTrips} <span class="text-xs font-normal text-slate-400 font-sans">km</span>`;
            document.getElementById('resFactorVal').innerText = `${factor} kg/km`;

            const newTrip = {
                id: 'custom-' + Date.now(),
                date: travelDate,
                route: `${startLoc} → ${endLoc}`,
                mode: mode,
                distance: distance * numTrips,
                emissions: totalEmissions,
                desc: desc,
                isDemo: false
            };

            userCustomTrips.unshift(newTrip);
        }

        // Professional "Load Data" Feature (Does NOT contaminate user custom saves)
        function handleLoadDataClick() {
            isDataStreamLoaded = true;
            loadedTelemetryTrips = JSON.parse(JSON.stringify(defaultCommuteTelemetry));
            document.getElementById('dataStreamBanner').classList.remove('hidden');
            switchView('dashboard');
            
            const banner = document.getElementById('dataStreamBanner');
            banner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }

        function clearLoadedData() {
            isDataStreamLoaded = false;
            loadedTelemetryTrips = [];
            document.getElementById('dataStreamBanner').classList.add('hidden');
            updateDashboard();
            if(!document.getElementById('view-trips').classList.contains('hidden')) {
                renderTripsTable();
            }
        }

        function toggleDataBanner(status) {
            const banner = document.getElementById('dataStreamBanner');
            if(!status) banner.classList.add('hidden');
            else banner.classList.remove('hidden');
        }

        // Helper to get active display records (Combines real user custom trips + loaded demo trips)
        function getActiveTrips() {
            return [...userCustomTrips, ...loadedTelemetryTrips];
        }

        // Dashboard Analytics & Chart.js Rendering (Professional Blue Theme)
        function updateDashboard() {
            const trips = getActiveTrips();
            const totalEmissions = trips.reduce((acc, t) => acc + t.emissions, 0);
            const totalDistance = trips.reduce((acc, t) => acc + t.distance, 0);
            const avgIntensity = totalDistance > 0 ? (totalEmissions / totalDistance).toFixed(2) : '0.00';

            let modeCounts = {};
            trips.forEach(t => {
                modeCounts[t.mode] = (modeCounts[t.mode] || 0) + 1;
            });
            let topMode = 'None';
            let maxCount = 0;
            for(let m in modeCounts) {
                if(modeCounts[m] > maxCount) {
                    maxCount = modeCounts[m];
                    topMode = m;
                }
            }

            document.getElementById('kpiEmissions').innerText = totalEmissions.toFixed(2);
            document.getElementById('kpiDistance').innerText = totalDistance;
            document.getElementById('kpiIntensity').innerText = avgIntensity;
            document.getElementById('kpiTopMode').innerText = topMode;

            // Ceiling limit target: 30 kg CO2e
            const goalTarget = 30;
            const goalPercent = Math.min(100, Math.round((totalEmissions / goalTarget) * 100));
            document.getElementById('goalPercentageText').innerText = `${goalPercent}% of ceiling`;
            document.getElementById('goalProgressBar').style.width = `${goalPercent}%`;

            renderTrendChart(trips);
            renderModeChart(trips);
        }

        function renderTrendChart(trips) {
            const canvas = document.getElementById('trendChart');
            if(!canvas) return;
            const ctx = canvas.getContext('2d');
            if(trendChartInstance) trendChartInstance.destroy();

            const sorted = [...trips].sort((a, b) => new Date(a.date) - new Date(b.date));
            const labels = sorted.map(t => t.date);
            const data = sorted.map(t => t.emissions);

            const gradient = ctx.createLinearGradient(0, 0, 0, 260);
            gradient.addColorStop(0, 'rgba(37, 99, 235, 0.22)');
            gradient.addColorStop(1, 'rgba(37, 99, 235, 0.0)');

            trendChartInstance = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels.length ? labels : ['No Telemetry Active'],
                    datasets: [{
                        label: 'Emissions (kg CO₂e)',
                        data: data.length ? data : [0],
                        borderColor: '#2563EB',
                        backgroundColor: gradient,
                        borderWidth: 2.5,
                        fill: true,
                        tension: 0.35,
                        pointBackgroundColor: '#0B192C',
                        pointBorderColor: '#38BDF8',
                        pointBorderWidth: 2,
                        pointRadius: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            backgroundColor: '#0B192C',
                            titleColor: '#F8FAFC',
                            bodyColor: '#38BDF8',
                            borderColor: '#1E293B',
                            borderWidth: 1,
                            padding: 10
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: { color: '#F1F5F9' },
                            ticks: { font: { family: 'JetBrains Mono', size: 10 } }
                        },
                        x: {
                            grid: { display: false },
                            ticks: { font: { family: 'JetBrains Mono', size: 10 } }
                        }
                    }
                }
            });
        }

        function renderModeChart(trips) {
            const canvas = document.getElementById('modeChart');
            if(!canvas) return;
            const ctx = canvas.getContext('2d');
            if(modeChartInstance) modeChartInstance.destroy();

            let modeEmissions = {};
            trips.forEach(t => {
                modeEmissions[t.mode] = (modeEmissions[t.mode] || 0) + t.emissions;
            });

            const labels = Object.keys(modeEmissions);
            const data = Object.values(modeEmissions);

            modeChartInstance = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: labels.length ? labels : ['No Telemetry'],
                    datasets: [{
                        data: data.length ? data : [1],
                        backgroundColor: ['#1D4ED8', '#2563EB', '#0284C7', '#0EA5E9', '#38BDF8', '#64748B', '#0B192C'],
                        borderWidth: 2,
                        borderColor: '#FFFFFF'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '68%',
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                boxWidth: 10,
                                font: { size: 11, family: 'Inter', weight: '600' },
                                padding: 12
                            }
                        }
                    }
                }
            });
        }

        // Trips Table Management
        function renderTripsTable() {
            const tbody = document.getElementById('tripsTableBody');
            const emptyState = document.getElementById('tripsEmptyState');
            const searchQuery = document.getElementById('tripSearch').value.toLowerCase();
            const filterMode = document.getElementById('filterMode').value;

            tbody.innerHTML = '';

            let trips = getActiveTrips();
            let filtered = trips.filter(t => {
                const matchSearch = t.route.toLowerCase().includes(searchQuery) || t.desc.toLowerCase().includes(searchQuery);
                const matchMode = filterMode === '' || t.mode === filterMode;
                return matchSearch && matchMode;
            });

            document.getElementById('tripCountBadge').innerText = `${filtered.length} Records Active`;

            if(filtered.length === 0) {
                emptyState.classList.remove('hidden');
                return;
            } else {
                emptyState.classList.add('hidden');
            }

            filtered.forEach(t => {
                const tr = document.createElement('tr');
                tr.className = 'hover:bg-slate-50 transition-all';
                tr.innerHTML = `
                    <td class="p-4 font-mono-num text-[11px] font-semibold text-slate-600">${t.date}</td>
                    <td class="p-4">
                        <span class="font-bold text-navyHeading block">${t.route}</span>
                        <span class="text-[11px] text-mutedSlate">${t.desc}</span>
                    </td>
                    <td class="p-4">
                        <span class="bg-lightGrey text-navyHeading px-2.5 py-1 rounded-md text-[11px] font-semibold border border-borderSlate">${t.mode}</span>
                    </td>
                    <td class="p-4 font-mono-num font-medium">${t.distance} km</td>
                    <td class="p-4 font-mono-num font-bold text-corpBlue">${t.emissions} kg</td>
                    <td class="p-4 text-right">
                        <button onclick="deleteTrip('${t.id}')" class="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-all" title="Remove Record">
                            <i data-lucide="trash-2" class="w-4 h-4"></i>
                        </button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
            lucide.createIcons();
        }

        function deleteTrip(id) {
            userCustomTrips = userCustomTrips.filter(t => t.id !== id);
            loadedTelemetryTrips = loadedTelemetryTrips.filter(t => t.id !== id);
            renderTripsTable();
            updateDashboard();
        }

        // Export Trips to CSV for SQLite/MySQL Backend Audit
        function exportTripsCSV() {
            const trips = getActiveTrips();
            if(trips.length === 0) {
                alert("No trips to export. Click 'Load Data' or add a trip first.");
                return;
            }

            let csv = "ID,Date,Route,Mode,Distance_KM,Emissions_KG_CO2e,Description\n";
            trips.forEach(t => {
                csv += `"${t.id}","${t.date}","${t.route}","${t.mode}",${t.distance},${t.emissions},"${t.desc}"\n`;
            });

            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement("a");
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", `ecopulse_trips_export_${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }

        // Recommendations Engine
        function renderRecommendations() {
            const container = document.getElementById('recommendationsContainer');
            container.innerHTML = '';

            const recs = [
                {
                    title: "Shift Solo Highway Commute to Suburban Rail",
                    savings: "14.2 kg CO₂e / week",
                    feasibility: "High Feasibility",
                    desc: "Transitioning solo sedan commutes over 15 km to rapid suburban rail lines slashes personal carbon intensity by upwards of 82%."
                },
                {
                    title: "Deploy Electric Two-Wheeler for Micro-Trips",
                    savings: "8.6 kg CO₂e / week",
                    feasibility: "High Feasibility",
                    desc: "Replacing petrol motorcycles for short errands under 8 km saves fuel costs and avoids direct localized tailpipe particulate matter."
                },
                {
                    title: "Activate Regional Carpool in Community Chat",
                    savings: "12.0 kg CO₂e / week",
                    feasibility: "Immediate Action",
                    desc: "Use the Eco Pulse Community Chat to share vehicle occupancy with neighbors traveling the same corridor."
                },
                {
                    title: "Pedestrian or Cycle Commutes for < 3 km Journeys",
                    savings: "4.5 kg CO₂e / week",
                    feasibility: "Very High Feasibility",
                    desc: "Zero emissions, zero fuel expenditure, and enhanced personal health and cardiovascular rhythm."
                }
            ];

            recs.forEach(r => {
                const card = document.createElement('div');
                card.className = 'bg-white p-6 rounded-2xl border border-borderSlate shadow-2xs space-y-4 hover:border-slate-300 transition-all';
                card.innerHTML = `
                    <div class="flex items-start justify-between">
                        <span class="text-xs bg-lightGrey text-navyHeading px-3 py-1 rounded-md font-bold border border-borderSlate">${r.feasibility}</span>
                        <span class="text-xs font-mono-num font-bold text-corpBlue bg-blueTint px-3 py-1 rounded-md border border-blueBorder">Avoids: ${r.savings}</span>
                    </div>
                    <h3 class="font-bold text-navyHeading text-base">${r.title}</h3>
                    <p class="text-xs text-mutedSlate leading-relaxed">${r.desc}</p>
                    <div class="pt-3 border-t border-borderSlate flex items-center justify-between text-xs">
                        <span class="text-mutedSlate font-mono-num text-[11px]">Ranked by Decision Engine</span>
                        <button onclick="switchView('calculator')" class="text-corpBlue font-bold hover:underline transition-colors flex items-center space-x-1">
                            <span>Calculate Journey</span>
                            <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
                        </button>
                    </div>
                `;
                container.appendChild(card);
            });
            lucide.createIcons();
        }

        // =============================================================
        // COMMUNITY CHAT GROUP (AREA-BASED) ENGINE
        // =============================================================
        function handleAreaChange(areaKey) {
            currentActiveAreaKey = areaKey;
            const area = areaData[areaKey];
            if(!area) return;

            document.getElementById('topZoneTag').innerHTML = `Region: <strong class="text-white">${area.name.split(' (')[0]}</strong>`;
            document.getElementById('chatGroupName').innerText = `${area.name.split(' (')[0]} Commuters`;
            document.getElementById('chatSubtext').innerText = area.subtext;
            document.getElementById('areaOnlineCount').innerText = area.onlineCount;
            document.getElementById('areaCarbonSaved').innerText = area.carbonSaved;
            document.getElementById('areaRank').innerText = area.rank;

            renderAreaChat(areaKey);
        }

        function renderAreaChat(areaKey) {
            const feed = document.getElementById('areaChatFeed');
            if(!feed) return;
            const area = areaData[areaKey] || areaData.mumbai;
            
            feed.innerHTML = '';

            area.messages.forEach(msg => {
                const isYou = msg.sender === 'You';
                const div = document.createElement('div');
                div.className = `flex flex-col ${isYou ? 'items-end' : 'items-start'} space-y-1`;

                div.innerHTML = `
                    <div class="flex items-center space-x-2 text-[11px] text-mutedSlate">
                        <span class="font-bold ${isYou ? 'text-corpBlue' : 'text-navyHeading'}">${msg.sender}</span>
                        ${msg.role ? `<span class="bg-lightGrey text-slate-700 text-[10px] px-1.5 py-0.2 rounded font-semibold border border-borderSlate">${msg.role}</span>` : ''}
                        <span>•</span>
                        <span class="font-mono-num">${msg.time}</span>
                    </div>
                    <div class="max-w-md rounded-2xl px-4 py-2.5 text-xs ${isYou ? 'bg-navyDark text-white rounded-br-none' : 'bg-white border border-borderSlate text-navyHeading rounded-bl-none shadow-2xs'}">
                        ${msg.text}
                    </div>
                `;
                feed.appendChild(div);
            });

            feed.scrollTop = feed.scrollHeight;
        }

        function handleSendAreaChat(e) {
            e.preventDefault();
            const input = document.getElementById('areaChatInput');
            const text = input.value.trim();
            if(!text) return;

            const area = areaData[currentActiveAreaKey];
            area.messages.push({
                id: Date.now(),
                sender: currentUser ? currentUser.split('@')[0] : 'You',
                role: 'Area Resident',
                time: 'Just now',
                text: text
            });

            input.value = '';
            renderAreaChat(currentActiveAreaKey);
        }

        function insertQuickChat(text) {
            document.getElementById('areaChatInput').value = text;
            document.getElementById('areaChatInput').focus();
        }

        // Modal Controls & Session Handling
        function openAuthModal() { document.getElementById('authModal').classList.remove('hidden'); }
        function closeAuthModal() { document.getElementById('authModal').classList.add('hidden'); }
        function handleAuthSubmit(e) {
            e.preventDefault();
            const email = document.getElementById('authEmail').value;
            currentUser = email;
            const zone = document.getElementById('authZone').value;
            handleAreaChange(zone);
            document.getElementById('authButtonText').innerText = email.split('@')[0];
            closeAuthModal();
        }

        function openPrivacyModal() { document.getElementById('privacyModal').classList.remove('hidden'); }
        function closePrivacyModal() { document.getElementById('privacyModal').classList.add('hidden'); }
        function openHelpModal() { document.getElementById('helpModal').classList.remove('hidden'); }
        function closeHelpModal() { document.getElementById('helpModal').classList.add('hidden'); }

        // =============================================================
        // VEHICLE-WISE CARBON EMISSION COMPARISON ENGINE (HOMEPAGE)
        // =============================================================
        const comparisonVehicles = [
            {
                id: 'bicycle',
                name: 'Bicycle (Zero Direct Emissions)',
                category: 'Active Mobility',
                calcMode: 'Bicycle',
                factor: 0, // g CO2e / pkm
                icon: 'bike',
                color: '#10B981',
                badge: 'Active Travel',
                badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                impactLabel: 'Zero Direct (Eco Champion)',
                impactClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
                isLowest: true,
                isZero: true,
                notes: '0 g/pkm • Human-powered operational baseline'
            },
            {
                id: 'train',
                name: 'Suburban Train / Metro Rail',
                category: 'Electric Commuter Rail',
                calcMode: 'Metro or local train',
                factor: 30, // g CO2e / pkm
                icon: 'train',
                color: '#0D9488',
                badge: 'Mass Rapid Transit',
                badgeClass: 'bg-teal-50 text-teal-700 border-teal-200',
                impactLabel: 'Ultra-Low Impact',
                impactClass: 'bg-teal-100 text-teal-800 border-teal-300',
                isLowest: false,
                isZero: false,
                notes: '30 g/pkm • High capacity passenger loading'
            },
            {
                id: 'bus',
                name: 'Public Transit Bus',
                category: 'Municipal Shared Bus',
                calcMode: 'Bus',
                factor: 40, // g CO2e / pkm
                icon: 'bus',
                color: '#2563EB',
                badge: 'Public Transit',
                badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
                impactLabel: 'Low Impact (Shared)',
                impactClass: 'bg-blue-100 text-blue-800 border-blue-300',
                isLowest: false,
                isZero: false,
                notes: '40 g/pkm • ~25 Passengers average occupancy'
            },
            {
                id: 'electric-car',
                name: 'Electric Car (BEV)',
                category: 'Battery Electric Vehicle',
                calcMode: 'Electric car',
                factor: 50, // g CO2e / pkm
                icon: 'zap',
                color: '#0284C7',
                badge: 'Grid-Charged EV',
                badgeClass: 'bg-sky-50 text-sky-700 border-sky-200',
                impactLabel: 'Moderate-Low Impact',
                impactClass: 'bg-sky-100 text-sky-800 border-sky-300',
                isLowest: false,
                isZero: false,
                notes: '50 g/pkm • Lifecycle grid average generation'
            },
            {
                id: 'motorcycle',
                name: 'Motorcycle / Scooter',
                category: 'Petrol Two-Wheeler',
                calcMode: 'Petrol motorcycle or scooter',
                factor: 100, // g CO2e / pkm
                icon: 'gauge',
                color: '#D97706',
                badge: 'Petrol 2-Wheeler',
                badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
                impactLabel: 'Moderate Impact',
                impactClass: 'bg-amber-100 text-amber-800 border-amber-300',
                isLowest: false,
                isZero: false,
                notes: '100 g/pkm • Single rider commuter standard'
            },
            {
                id: 'diesel-car',
                name: 'Diesel Car',
                category: 'Compression Ignition ICE',
                calcMode: 'Diesel car',
                factor: 170, // g CO2e / pkm
                icon: 'fuel',
                color: '#EA580C',
                badge: 'Diesel Passenger Car',
                badgeClass: 'bg-orange-50 text-orange-700 border-orange-200',
                impactLabel: 'High Impact',
                impactClass: 'bg-orange-100 text-orange-800 border-orange-300',
                isLowest: false,
                isZero: false,
                notes: '170 g/pkm • High efficiency diesel passenger car'
            },
            {
                id: 'petrol-car',
                name: 'Petrol Car',
                category: 'Internal Combustion Engine',
                calcMode: 'Petrol car',
                factor: 190, // g CO2e / pkm
                icon: 'car',
                color: '#E11D48',
                badge: 'Standard Petrol Car',
                badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
                impactLabel: 'Highest Impact',
                impactClass: 'bg-rose-100 text-rose-800 border-rose-300',
                isLowest: false,
                isZero: false,
                notes: '190 g/pkm • Baseline sedan single occupant'
            }
        ];

        function initVehicleComparison() {
            updateVehicleComparison();
        }

        function handleCompareInputChange() {
            updateVehicleComparison();
        }

        function applyComparePreset(start, end, distance) {
            const startInput = document.getElementById('cmpStartLoc');
            const endInput = document.getElementById('cmpEndLoc');
            const distInput = document.getElementById('cmpDistance');
            if(startInput) startInput.value = start;
            if(endInput) endInput.value = end;
            if(distInput) distInput.value = distance;
            updateVehicleComparison();
        }

        function sendToCalculator(mode, distance, startLoc, endLoc, pax) {
            applyPreset(startLoc || 'Origin', endLoc || 'Destination', distance, mode, pax || 1);
            switchView('calculator');
        }

        function updateVehicleComparison() {
            const startInput = document.getElementById('cmpStartLoc');
            const endInput = document.getElementById('cmpEndLoc');
            const distInput = document.getElementById('cmpDistance');
            const occInput = document.getElementById('cmpOccupancy');
            const errBox = document.getElementById('cmpValidationError');
            const tbody = document.getElementById('cmpTableBody');
            const routeTitle = document.getElementById('cmpActiveRouteTitle');
            const distBadge = document.getElementById('cmpActiveDistanceBadge');
            const savingsEl = document.getElementById('cmpMaxSavings');

            if(!distInput || !tbody) return;

            const startLoc = (startInput && startInput.value.trim()) ? startInput.value.trim() : 'Origin Point';
            const endLoc = (endInput && endInput.value.trim()) ? endInput.value.trim() : 'Destination Point';
            const distanceVal = parseFloat(distInput.value);
            const occupancy = occInput ? (parseInt(occInput.value) || 1) : 1;

            // Route title update
            if(routeTitle) {
                routeTitle.innerText = `${startLoc} → ${endLoc}`;
            }

            // Input validation check
            if(isNaN(distanceVal) || distanceVal <= 0) {
                if(errBox) errBox.classList.remove('hidden');
                distInput.classList.add('border-rose-400', 'focus:ring-rose-400');
                distInput.classList.remove('border-borderSlate', 'focus:ring-corpBlue/40');
                tbody.innerHTML = `
                    <tr>
                        <td colspan="6" class="p-8 text-center text-mutedSlate">
                            <div class="max-w-md mx-auto space-y-2">
                                <i data-lucide="alert-circle" class="w-6 h-6 text-rose-500 mx-auto"></i>
                                <p class="font-bold text-navyHeading text-sm">Please enter a valid travel distance</p>
                                <p class="text-xs">Provide a travel distance in kilometers greater than 0, or click any of the quick corridors above to calculate vehicle emissions.</p>
                            </div>
                        </td>
                    </tr>
                `;
                if(distBadge) distBadge.innerText = '0.0 km';
                if(savingsEl) savingsEl.innerText = '0.00 kg CO₂e';
                if(window.lucide) lucide.createIcons();
                return;
            }

            // Hide validation error if valid
            if(errBox) errBox.classList.add('hidden');
            distInput.classList.remove('border-rose-400', 'focus:ring-rose-400');
            distInput.classList.add('border-borderSlate', 'focus:ring-corpBlue/40');

            if(distBadge) distBadge.innerText = `${distanceVal.toFixed(1)} km`;

            // Baseline maximum emission (Petrol Car)
            // Total estimated emissions (kg CO2e) = Distance (km) * Emission factor (g CO2e/passenger-km) / 1000
            const maxPetrolTotal = (distanceVal * 190) / 1000;
            if(savingsEl) {
                savingsEl.innerText = `${maxPetrolTotal.toFixed(2)} kg CO₂e`;
            }

            tbody.innerHTML = '';

            comparisonVehicles.forEach(veh => {
                // Formula: Distance (km) * Emission factor (g CO2e/passenger-km) / 1000
                const totalEmissionsKg = (distanceVal * veh.factor) / 1000;
                
                // Passenger-level emissions:
                // For shared mass transit (Rail, Bus) and Bicycle, factor is per passenger.
                // For private passenger cars/EVs, divide total vehicle emissions by vehicle occupancy.
                let paxEmissionsKg = 0;
                if(veh.id === 'bicycle') {
                    paxEmissionsKg = 0;
                } else if(['train', 'bus'].includes(veh.id)) {
                    paxEmissionsKg = totalEmissionsKg;
                } else {
                    paxEmissionsKg = totalEmissionsKg / Math.max(1, occupancy);
                }

                const barPercent = maxPetrolTotal > 0 ? Math.min(100, Math.round((totalEmissionsKg / maxPetrolTotal) * 100)) : 0;
                const isLowest = veh.isLowest;

                const tr = document.createElement('tr');
                tr.className = `transition-all ${isLowest ? 'bg-emerald-50/60 hover:bg-emerald-50/90 border-l-4 border-l-emerald-500' : 'hover:bg-slate-50'}`;

                tr.innerHTML = `
                    <!-- Vehicle Type Column -->
                    <td class="p-4">
                        <div class="flex items-center space-x-3">
                            <div class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isLowest ? 'bg-emerald-100 text-emerald-700 border border-emerald-300 shadow-2xs' : 'bg-lightGrey text-navyHeading border border-borderSlate'}">
                                <i data-lucide="${veh.icon}" class="w-5 h-5"></i>
                            </div>
                            <div>
                                <div class="flex items-center space-x-2">
                                    <span class="font-bold text-navyHeading text-xs sm:text-sm block">${veh.name}</span>
                                    ${isLowest ? `
                                        <span class="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-200/80 text-emerald-900 border border-emerald-300 font-mono-num">
                                            <i data-lucide="award" class="w-3 h-3 text-emerald-700"></i>
                                            <span>LOWEST EMISSION</span>
                                        </span>
                                    ` : ''}
                                </div>
                                <span class="text-[11px] text-mutedSlate">${veh.notes}</span>
                            </div>
                        </div>
                    </td>

                    <!-- Travel Distance (km) Column -->
                    <td class="p-4 font-mono-num font-semibold text-xs text-slate-700">
                        ${distanceVal.toFixed(1)} km
                    </td>

                    <!-- Estimated CO2 Emissions (kg CO2e) Column -->
                    <td class="p-4">
                        <div class="space-y-1.5 max-w-[200px]">
                            <div class="flex items-baseline space-x-1">
                                <span class="text-base sm:text-lg font-extrabold font-mono-num ${isLowest ? 'text-emerald-700' : 'text-navyHeading'}">
                                    ${totalEmissionsKg.toFixed(2)}
                                </span>
                                <span class="text-[11px] text-mutedSlate font-sans">kg CO₂e</span>
                            </div>
                            <!-- Visual Relative Intensity Bar -->
                            <div class="w-full bg-slate-200/70 rounded-full h-1.5 overflow-hidden">
                                <div class="h-1.5 rounded-full transition-all duration-500" style="width: ${Math.max(barPercent, isLowest ? 0 : 4)}%; background-color: ${veh.color};"></div>
                            </div>
                        </div>
                    </td>

                    <!-- Emissions per Passenger Column -->
                    <td class="p-4 font-mono-num text-xs">
                        <div class="space-y-0.5">
                            <span class="font-bold ${isLowest ? 'text-emerald-700' : 'text-navyHeading'} block">
                                ${paxEmissionsKg.toFixed(2)} <span class="font-normal text-[11px] text-mutedSlate font-sans">kg/pax</span>
                            </span>
                            <span class="text-[10px] text-mutedSlate font-sans block">
                                ${veh.isZero ? '0 g/pkm' : `${veh.factor} g CO₂e/pkm`}
                                ${(!['train', 'bus', 'bicycle'].includes(veh.id) && occupancy > 1) ? ` (÷${occupancy} pax)` : ''}
                            </span>
                        </div>
                    </td>

                    <!-- Relative Environmental Impact Column -->
                    <td class="p-4">
                        <span class="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold border ${veh.impactClass}">
                            ${isLowest ? '<i data-lucide="sparkles" class="w-3 h-3 text-emerald-600"></i>' : ''}
                            <span>${veh.impactLabel}</span>
                        </span>
                    </td>

                    <!-- Action Column -->
                    <td class="p-4 text-right">
                        <button type="button" onclick="sendToCalculator('${veh.calcMode}', ${distanceVal}, '${startLoc}', '${endLoc}', ${occupancy})" class="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-bold text-corpBlue hover:text-white hover:bg-corpBlue border border-blueBorder hover:border-corpBlue transition-all shadow-2xs" title="Calculate full journey with this mode">
                            <span>Calculate</span>
                            <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
                        </button>
                    </td>
                `;

                tbody.appendChild(tr);
            });

            if(window.lucide) {
                lucide.createIcons();
            }
        }

