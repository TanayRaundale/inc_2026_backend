const eventsName = ['concepts', 'impetus', 'pradnya', 'nova']

// const projectDomains = new Map([
//     ['concepts', ['APPLICATION DEVELOPMENT', 'COMMUNICATION NETWORKS AND SECURITY SYSTEMS', 'DIGITAL / IMAGE/ SPEECH / VIDEO PROCESSING', 'EMBEDDED/VLSI SYSTEMS', 'MACHINE LEARNING AND PATTERN RECOGNITION', 'OTHERS']],
//     ['impetus', ['MACHINE LEARNING AND PATTERN RECOGNITION', 'BIG DATA ANALYTICS', 'COMMUNICATION NETWORKS & SECURITY SYSTEMS', 'VIRTUALIZATION AND AUTOMATIC COMPUTING', 'DIGITAL / IMAGE/ SPEECH / VIDEO PROCESSING', 'VLSI DESIGN AND TEST', 'EMBEDDED SYSTEMS', 'BLOCKCHAIN', 'APPLICATION', 'OTHERS']],
// ])

const projectDomains = {
    'AD': 'APPLICATION DEVELOPMENT',
    'CN': 'COMMUNICATION NETWORKS AND SECURITY SYSTEMS',
    'DS': 'DIGITAL / IMAGE/ SPEECH / VIDEO PROCESSING',
    'ES': 'EMBEDDED/VLSI SYSTEMS',
    'ML': 'MACHINE LEARNING AND PATTERN RECOGNITION',
    'OT': 'OTHERS'
}

// const subDomains = new Map([
//     ['ML', {
//         'KR': 'Knowledge representation',
//         'ML': 'Machine learning',
//         'DL': 'Deep learning',
//         'NLP': 'Natural Language Processing',
//         'HCI': 'Human computer interaction',
//         'WDM': 'Web Data Mining',
//         'CBIR': 'Content Based Information Retrieval',
//         'OT': 'Others'
//     }],
//     ['CN', {
//         'CN': 'Computer networks',
//         'IOT': 'Internet of Things',
//         'SDN': 'Software Defined Network',
//         'VN': 'Vehicular Networks',
//         'WMN': 'Wireless and Mobile Networks',
//         'INS': 'Information and Network Security',
//         'GP': 'GPS | GSM Projects',
//         'WC': 'Wireless Communication',
//         'ARFC': 'Antenna & RF Communication',
//         'OCN': 'Optical Communication & Network',
//         'OT': 'Others'
//     }],
//     ['']
//     // "Virtualization and Autonomic Computing": {
//     //     "High Speed Network": 1,
//     //     "Security in Cloud": 2,
//     //     "Cloud Computing": 3,
//     //     "Data center Management": 4,
//     //     "Handling Big Data on Cloud": 5,
//     //     "Mobile Cloud": 6,
//     //     "Cloud Forensics": 7,
//     //     "Fog Computing": 8,
//     //     "Others": 9,
//     // },
//     // "Digital / Image/ Speech / Video Processing ": {
//     //     "Digital Signal processing": 1,
//     //     "Image processing": 2,
//     //     "Speech recognition": 3,
//     //     "Video processing": 4,
//     //     "Speech to text / Text to speech": 5,
//     //     "Others": 6,
//     // },
//     // "VLSI Design & Test": {
//     //     "Analog & Mixed Signal VLSI Design": 1,
//     //     "Testing & Verification of VLSI Design": 2,
//     //     "Others": 3,
//     // },
//     // "Embedded Systems": {
//     //     "Image Processing & Remote Sensing": 1,
//     //     "Machine Learning for Embedded Systems": 2,
//     //     "Embedded Vision": 3,
//     //     "Internet of Things": 4,
//     //     "Others": 5,
//     // },
//     // 	"Blockchain": {
//     //     "Smart City": 1,
//     //     "E-governance": 2,
//     //     "Healthcare": 3,
//     //     "E-School": 4,
//     //     "Supply Chain Management": 5,
//     //     "Identity and Access Management": 6,
//     //     "Others": 7,

//     // },
//     // "Applications": {
//     //     "Mobile Applications (Android)": 1,
//     //     "Web Applications": 2,
//     //     "Database applications": 3,
//     //     "Others": 4,
//     // },

//     // "Others":{
//     // 	"Bio-Signal Processing":1,
//     // 	"Bio medical":2,
//     // 	"Bio informatics":3,
//     // 	"Nano Technology":4,
//     // 	"Others":5,
//     // },
// ])

const projectTypes = ['Open Software', 'Open Hardware/Firmware']

const teamSize = new Map([
    ['concepts', 6],
    ['impetus', 6],
    ['pradnya', 2],
    ['nova', 5],
])

const slotsData = {
    '1': 'Friday, 21st March (11:00 AM - 2:00 PM)',
    '2': 'Friday, 21st March (2:00 PM - 7:00 PM)',
    '3': 'Saturday, 22nd March (10:00 AM - 1:00 PM)',
    '4': 'Saturday, 22nd March (1:00 PM - 4:00 PM)',
    '5': 'Saturday, 22nd March (4:00 PM - 7:00 PM)',
}

const getJudgingSlots = (event_name) => {
    
	const judgingSlotsImpetus = {
        "1": "Friday, 27th March (11:00 AM - 2:00 PM)",
        "2": "Friday, 27th March (2:00 PM - 5:00 PM)",
        "3": "Friday, 27th March (5:00 PM - 7:00 PM)",
        "4": "Saturday, 28th March (9:00 AM - 12:00 PM)",
        "5": "Saturday, 28th March (1:00 PM - 3:00 PM)",
        "6": "Saturday, 28th March (4:00 PM - 6:00 PM)"
    };
    
    const judgingSlotsConcepts = {
        "1": "Friday, 27th March (11:00 AM - 2:00 PM)",
        "2": "Friday, 27th March (2:00 PM - 4:00 PM)",
        "3": "Friday, 27th March (4:00 PM - 7:00 PM)",
        "4": "Saturday, 28th March (10:00 AM - 1:00 PM)",
        "5": "Saturday, 28th March (1:00 PM - 4:00 PM)",
        "6": "Saturday, 28th March (4:00 PM - 7:00 PM)"
    };

	if(event_name === 'impetus'){
		return judgingSlotsImpetus;
	}
	else if(event_name === 'concepts'){
		return judgingSlotsConcepts;
	}
}

const paymentLinks = new Map([
    ['test', 'https://easebuzz.in/quickpay/owhseppfut'],
    ['concepts', 'https://easebuzz.in/quickpay/pkwfmmpssi'],
    ['impetus', 'https://easebuzz.in/quickpay/jkxuiptnhq'],
    ['pradnya', 'https://easebuzz.in/quickpay/cwxuyvrypr'],
])

export {
    eventsName,
    projectDomains,
    projectTypes,
    teamSize,
    slotsData,
    paymentLinks,
    getJudgingSlots,

}