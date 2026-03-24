const roles = ['WEB_MASTER', 'ADMIN', 'VIEWER', 'PAYMENTS', 'CONCEPTS_ADMIN', 'IMPETUS_ADMIN', 'PRADNYA_ADMIN', 'JUDGE']

const groupLinks = new Map([
    ['concepts', ['Concepts Judging (InC\'24)', 'https://chat.whatsapp.com/D9ySvNZzL1HL4Vk30pKyGv']],
    ['impetus', ['Impetus judging 24', 'https://chat.whatsapp.com/H5KHmfiaUJpCZ0MctoLZD0']],
])

const officialEmails = new Map([
    ['queries', 'inc2k26@gmail.com'],
    ['info', 'info.pictinc@gmail.com'],
    ['judging', 'incjudging@pict.edu'], 
    ['concepts', 'concepts.pictinc2023@gmail.com'],
    ['impetus', 'impetus2025@gmail.com'],
    ['pradnya', 'pradnya.pictinc2023@gmail.com'],
    ['official', 'inc@pict.edu']
])



const whatsappLinks = new Map([
  ['impetus', 'https://chat.whatsapp.com/HUHge0i0goJAboddhJETF7'],
  ['concepts', 'https://chat.whatsapp.com/I07EdxAcmsG1ourZtldNp8'],
  ['pradnya', 'https://chat.whatsapp.com/FMayBZIo87y8o9nXplY5Kk'],
])


const projects = [
    {
      "projectTitle": "Developing a Smart Home System",
      "projectId": "001",
      "projectAbstract": "The aim of this project is to design and implement a smart home system that will allow users to control their home appliances and devices through a mobile app or voice commands."
    },
    {
      "projectTitle": "Creating a Social Networking Platform",
      "projectId": "002",
      "projectAbstract": "This project involves the development of a social networking platform that will allow users to connect with each other, share photos and videos, and post updates about their lives."
    },
    {
      "projectTitle": "Designing a Website for a Local Business",
      "projectId": "003",
      "projectAbstract": "In this project, we will be designing a website for a local business that will provide information about the services they offer, their hours of operation, and their contact information."
    },
    {
      "projectTitle": "Building a Personal Finance App",
      "projectId": "004",
      "projectAbstract": "The goal of this project is to develop a personal finance app that will help users track their spending, set savings goals, and manage their investments."
    },
    {
      "projectTitle": "Developing an E-commerce Platform",
      "projectId": "005",
      "projectAbstract": "This project involves building an e-commerce platform that will allow users to browse and purchase products online, as well as manage their orders and payments."
    },
    {
      "projectTitle": "Creating a Mobile Game",
      "projectId": "006",
      "projectAbstract": "In this project, we will be designing and developing a mobile game that will provide an engaging and entertaining experience for users."
    },
    {
      "projectTitle": "Building a Chatbot",
      "projectId": "007",
      "projectAbstract": "The aim of this project is to create a chatbot that will provide users with helpful information and assistance on a variety of topics."
    },
    {
      "projectTitle": "Developing a Fitness App",
      "projectId": "008",
      "projectAbstract": "This project involves building a fitness app that will allow users to track their workouts, set fitness goals, and monitor their progress over time."
    },
    {
      "projectTitle": "Designing a Food Delivery App",
      "projectId": "009",
      "projectAbstract": "In this project, we will be designing and developing a food delivery app that will allow users to order food from their favorite restaurants and have it delivered to their door."
    },
    {
      "projectTitle": "Building a Recommendation Engine",
      "projectId": "010",
      "projectAbstract": "The goal of this project is to build a recommendation engine that will provide users with personalized recommendations for products, services, and content based on their preferences and behavior."
    },
    {
      "projectTitle": "Building a Chatbot",
      "projectId": "007",
      "projectAbstract": "The aim of this project is to create a chatbot that will provide users with helpful information and assistance on a variety of topics."
    },
    {
      "projectTitle": "Developing a Fitness App",
      "projectId": "008",
      "projectAbstract": "This project involves building a fitness app that will allow users to track their workouts, set fitness goals, and monitor their progress over time."
    },
    {
      "projectTitle": "Designing a Food Delivery App",
      "projectId": "009",
      "projectAbstract": "In this project, we will be designing and developing a food delivery app that will allow users to order food from their favorite restaurants and have it delivered to their door."
    },
    {
      "projectTitle": "Building a Chatbot",
      "projectId": "007",
      "projectAbstract": "The aim of this project is to create a chatbot that will provide users with helpful information and assistance on a variety of topics."
    },
    {
      "projectTitle": "Developing a Fitness App",
      "projectId": "008",
      "projectAbstract": "This project involves building a fitness app that will allow users to track their workouts, set fitness goals, and monitor their progress over time."
    },
    {
      "projectTitle": "Designing a Food Delivery App",
      "projectId": "009",
      "projectAbstract": "In this project, we will be designing and developing a food delivery app that will allow users to order food from their favorite restaurants and have it delivered to their door."
    },
    {
      "projectTitle": "Building a Chatbot",
      "projectId": "007",
      "projectAbstract": "The aim of this project is to create a chatbot that will provide users with helpful information and assistance on a variety of topics."
    },
    {
      "projectTitle": "Developing a Fitness App",
      "projectId": "008",
      "projectAbstract": "This project involves building a fitness app that will allow users to track their workouts, set fitness goals, and monitor their progress over time."
    },
    {
      "projectTitle": "Designing a Food Delivery App",
      "projectId": "009",
      "projectAbstract": "In this project, we will be designing and developing a food delivery app that will allow users to order food from their favorite restaurants and have it delivered to their door."
    },
    {
      "projectTitle": "Building a Chatbot",
      "projectId": "007",
      "projectAbstract": "The aim of this project is to create a chatbot that will provide users with helpful information and assistance on a variety of topics."
    },
    {
      "projectTitle": "Developing a Fitness App",
      "projectId": "008",
      "projectAbstract": "This project involves building a fitness app that will allow users to track their workouts, set fitness goals, and monitor their progress over time."
    },
    {
      "projectTitle": "Designing a Food Delivery App",
      "projectId": "009",
      "projectAbstract": "In this project, we will be designing and developing a food delivery app that will allow users to order food from their favorite restaurants and have it delivered to their door."
    },
    {
      "projectTitle": "Developing a Smart Home System",
      "projectId": "001",
      "projectAbstract": "The aim of this project is to design and implement a smart home system that will allow users to control their home appliances and devices through a mobile app or voice commands."
    },
    {
      "projectTitle": "Creating a Social Networking Platform",
      "projectId": "002",
      "projectAbstract": "This project involves the development of a social networking platform that will allow users to connect with each other, share photos and videos, and post updates about their lives."
    },
    {
      "projectTitle": "Designing a Website for a Local Business",
      "projectId": "003",
      "projectAbstract": "In this project, we will be designing a website for a local business that will provide information about the services they offer, their hours of operation, and their contact information."
    },
    {
      "projectTitle": "Building a Personal Finance App",
      "projectId": "004",
      "projectAbstract": "The goal of this project is to develop a personal finance app that will help users track their spending, set savings goals, and manage their investments."
    },
    {
      "projectTitle": "Developing an E-commerce Platform",
      "projectId": "005",
      "projectAbstract": "This project involves building an e-commerce platform that will allow users to browse and purchase products online, as well as manage their orders and payments."
    },
    {
      "projectTitle": "Creating a Mobile Game",
      "projectId": "006",
      "projectAbstract": "In this project, we will be designing and developing a mobile game that will provide an engaging and entertaining experience for users."
    },
    {
      "projectTitle": "Building a Chatbot",
      "projectId": "007",
      "projectAbstract": "The aim of this project is to create a chatbot that will provide users with helpful information and assistance on a variety of topics."
    },
    {
      "projectTitle": "Developing a Fitness App",
      "projectId": "008",
      "projectAbstract": "This project involves building a fitness app that will allow users to track their workouts, set fitness goals, and monitor their progress over time."
    },
    {
      "projectTitle": "Designing a Food Delivery App",
      "projectId": "009",
      "projectAbstract": "In this project, we will be designing and developing a food delivery app that will allow users to order food from their favorite restaurants and have it delivered to their door."
    },
    {
      "projectTitle": "Building a Recommendation Engine",
      "projectId": "010",
      "projectAbstract": "The goal of this project is to build a recommendation engine that will provide users with personalized recommendations for products, services, and content based on their preferences and behavior."
    },
    {
      "projectTitle": "Building a Chatbot",
      "projectId": "007",
      "projectAbstract": "The aim of this project is to create a chatbot that will provide users with helpful information and assistance on a variety of topics."
    },
    {
      "projectTitle": "Developing a Fitness App",
      "projectId": "008",
      "projectAbstract": "This project involves building a fitness app that will allow users to track their workouts, set fitness goals, and monitor their progress over time."
    },
    {
      "projectTitle": "Designing a Food Delivery App",
      "projectId": "009",
      "projectAbstract": "In this project, we will be designing and developing a food delivery app that will allow users to order food from their favorite restaurants and have it delivered to their door."
    },
    {
      "projectTitle": "Building a Chatbot",
      "projectId": "007",
      "projectAbstract": "The aim of this project is to create a chatbot that will provide users with helpful information and assistance on a variety of topics."
    },
    {
      "projectTitle": "Developing a Fitness App",
      "projectId": "008",
      "projectAbstract": "This project involves building a fitness app that will allow users to track their workouts, set fitness goals, and monitor their progress over time."
    },
    {
      "projectTitle": "Designing a Food Delivery App",
      "projectId": "009",
      "projectAbstract": "In this project, we will be designing and developing a food delivery app that will allow users to order food from their favorite restaurants and have it delivered to their door."
    },
    {
      "projectTitle": "Building a Chatbot",
      "projectId": "007",
      "projectAbstract": "The aim of this project is to create a chatbot that will provide users with helpful information and assistance on a variety of topics."
    },
    {
      "projectTitle": "Developing a Fitness App",
      "projectId": "008",
      "projectAbstract": "This project involves building a fitness app that will allow users to track their workouts, set fitness goals, and monitor their progress over time."
    },
    {
      "projectTitle": "Designing a Food Delivery App",
      "projectId": "009",
      "projectAbstract": "In this project, we will be designing and developing a food delivery app that will allow users to order food from their favorite restaurants and have it delivered to their door."
    },
    {
      "projectTitle": "Building a Chatbot",
      "projectId": "007",
      "projectAbstract": "The aim of this project is to create a chatbot that will provide users with helpful information and assistance on a variety of topics."
    },
    {
      "projectTitle": "Developing a Fitness App",
      "projectId": "008",
      "projectAbstract": "This project involves building a fitness app that will allow users to track their workouts, set fitness goals, and monitor their progress over time."
    },
    {
      "projectTitle": "Designing a Food Delivery App",
      "projectId": "009",
      "projectAbstract": "In this project, we will be designing and developing a food delivery app that will allow users to order food from their favorite restaurants and have it delivered to their door."
    },
    {
      "projectTitle": "Developing a Smart Home System",
      "projectId": "001",
      "projectAbstract": "The aim of this project is to design and implement a smart home system that will allow users to control their home appliances and devices through a mobile app or voice commands."
    },
    {
      "projectTitle": "Creating a Social Networking Platform",
      "projectId": "002",
      "projectAbstract": "This project involves the development of a social networking platform that will allow users to connect with each other, share photos and videos, and post updates about their lives."
    },
    {
      "projectTitle": "Designing a Website for a Local Business",
      "projectId": "003",
      "projectAbstract": "In this project, we will be designing a website for a local business that will provide information about the services they offer, their hours of operation, and their contact information."
    },
    {
      "projectTitle": "Building a Personal Finance App",
      "projectId": "004",
      "projectAbstract": "The goal of this project is to develop a personal finance app that will help users track their spending, set savings goals, and manage their investments."
    },
    {
      "projectTitle": "Developing an E-commerce Platform",
      "projectId": "005",
      "projectAbstract": "This project involves building an e-commerce platform that will allow users to browse and purchase products online, as well as manage their orders and payments."
    },
    {
      "projectTitle": "Creating a Mobile Game",
      "projectId": "006",
      "projectAbstract": "In this project, we will be designing and developing a mobile game that will provide an engaging and entertaining experience for users."
    },
    {
      "projectTitle": "Building a Chatbot",
      "projectId": "007",
      "projectAbstract": "The aim of this project is to create a chatbot that will provide users with helpful information and assistance on a variety of topics."
    },
    {
      "projectTitle": "Developing a Fitness App",
      "projectId": "008",
      "projectAbstract": "This project involves building a fitness app that will allow users to track their workouts, set fitness goals, and monitor their progress over time."
    },
    {
      "projectTitle": "Designing a Food Delivery App",
      "projectId": "009",
      "projectAbstract": "In this project, we will be designing and developing a food delivery app that will allow users to order food from their favorite restaurants and have it delivered to their door."
    },
    {
      "projectTitle": "Building a Recommendation Engine",
      "projectId": "010",
      "projectAbstract": "The goal of this project is to build a recommendation engine that will provide users with personalized recommendations for products, services, and content based on their preferences and behavior."
    },
    {
      "projectTitle": "Building a Chatbot",
      "projectId": "007",
      "projectAbstract": "The aim of this project is to create a chatbot that will provide users with helpful information and assistance on a variety of topics."
    },
    {
      "projectTitle": "Developing a Fitness App",
      "projectId": "008",
      "projectAbstract": "This project involves building a fitness app that will allow users to track their workouts, set fitness goals, and monitor their progress over time."
    },
    {
      "projectTitle": "Designing a Food Delivery App",
      "projectId": "009",
      "projectAbstract": "In this project, we will be designing and developing a food delivery app that will allow users to order food from their favorite restaurants and have it delivered to their door."
    },
    {
      "projectTitle": "Building a Chatbot",
      "projectId": "007",
      "projectAbstract": "The aim of this project is to create a chatbot that will provide users with helpful information and assistance on a variety of topics."
    },
    {
      "projectTitle": "Developing a Fitness App",
      "projectId": "008",
      "projectAbstract": "This project involves building a fitness app that will allow users to track their workouts, set fitness goals, and monitor their progress over time."
    },
    {
      "projectTitle": "Designing a Food Delivery App",
      "projectId": "009",
      "projectAbstract": "In this project, we will be designing and developing a food delivery app that will allow users to order food from their favorite restaurants and have it delivered to their door."
    },
    {
      "projectTitle": "Building a Chatbot",
      "projectId": "007",
      "projectAbstract": "The aim of this project is to create a chatbot that will provide users with helpful information and assistance on a variety of topics."
    },
    {
      "projectTitle": "Developing a Fitness App",
      "projectId": "008",
      "projectAbstract": "This project involves building a fitness app that will allow users to track their workouts, set fitness goals, and monitor their progress over time."
    },
    {
      "projectTitle": "Designing a Food Delivery App",
      "projectId": "009",
      "projectAbstract": "In this project, we will be designing and developing a food delivery app that will allow users to order food from their favorite restaurants and have it delivered to their door."
    },
    {
      "projectTitle": "Building a Chatbot",
      "projectId": "007",
      "projectAbstract": "The aim of this project is to create a chatbot that will provide users with helpful information and assistance on a variety of topics."
    },
    {
      "projectTitle": "Developing a Fitness App",
      "projectId": "008",
      "projectAbstract": "This project involves building a fitness app that will allow users to track their workouts, set fitness goals, and monitor their progress over time."
    },
    {
      "projectTitle": "Designing a Food Delivery App",
      "projectId": "009",
      "projectAbstract": "In this project, we will be designing and developing a food delivery app that will allow users to order food from their favorite restaurants and have it delivered to their door."
    },
    {
      "projectTitle": "Developing a Smart Home System",
      "projectId": "001",
      "projectAbstract": "The aim of this project is to design and implement a smart home system that will allow users to control their home appliances and devices through a mobile app or voice commands."
    },
    {
      "projectTitle": "Creating a Social Networking Platform",
      "projectId": "002",
      "projectAbstract": "This project involves the development of a social networking platform that will allow users to connect with each other, share photos and videos, and post updates about their lives."
    },
    {
      "projectTitle": "Designing a Website for a Local Business",
      "projectId": "003",
      "projectAbstract": "In this project, we will be designing a website for a local business that will provide information about the services they offer, their hours of operation, and their contact information."
    },
    {
      "projectTitle": "Building a Personal Finance App",
      "projectId": "004",
      "projectAbstract": "The goal of this project is to develop a personal finance app that will help users track their spending, set savings goals, and manage their investments."
    },
    {
      "projectTitle": "Developing an E-commerce Platform",
      "projectId": "005",
      "projectAbstract": "This project involves building an e-commerce platform that will allow users to browse and purchase products online, as well as manage their orders and payments."
    },
    {
      "projectTitle": "Creating a Mobile Game",
      "projectId": "006",
      "projectAbstract": "In this project, we will be designing and developing a mobile game that will provide an engaging and entertaining experience for users."
    },
    {
      "projectTitle": "Building a Chatbot",
      "projectId": "007",
      "projectAbstract": "The aim of this project is to create a chatbot that will provide users with helpful information and assistance on a variety of topics."
    },
    {
      "projectTitle": "Developing a Fitness App",
      "projectId": "008",
      "projectAbstract": "This project involves building a fitness app that will allow users to track their workouts, set fitness goals, and monitor their progress over time."
    },
    {
      "projectTitle": "Designing a Food Delivery App",
      "projectId": "009",
      "projectAbstract": "In this project, we will be designing and developing a food delivery app that will allow users to order food from their favorite restaurants and have it delivered to their door."
    },
    {
      "projectTitle": "Building a Recommendation Engine",
      "projectId": "010",
      "projectAbstract": "The goal of this project is to build a recommendation engine that will provide users with personalized recommendations for products, services, and content based on their preferences and behavior."
    },
    {
      "projectTitle": "Building a Chatbot",
      "projectId": "007",
      "projectAbstract": "The aim of this project is to create a chatbot that will provide users with helpful information and assistance on a variety of topics."
    },
    {
      "projectTitle": "Developing a Fitness App",
      "projectId": "008",
      "projectAbstract": "This project involves building a fitness app that will allow users to track their workouts, set fitness goals, and monitor their progress over time."
    },
    {
      "projectTitle": "Designing a Food Delivery App",
      "projectId": "009",
      "projectAbstract": "In this project, we will be designing and developing a food delivery app that will allow users to order food from their favorite restaurants and have it delivered to their door."
    },
    {
      "projectTitle": "Building a Chatbot",
      "projectId": "007",
      "projectAbstract": "The aim of this project is to create a chatbot that will provide users with helpful information and assistance on a variety of topics."
    },
    {
      "projectTitle": "Developing a Fitness App",
      "projectId": "008",
      "projectAbstract": "This project involves building a fitness app that will allow users to track their workouts, set fitness goals, and monitor their progress over time."
    },
    {
      "projectTitle": "Designing a Food Delivery App",
      "projectId": "009",
      "projectAbstract": "In this project, we will be designing and developing a food delivery app that will allow users to order food from their favorite restaurants and have it delivered to their door."
    },
    {
      "projectTitle": "Building a Chatbot",
      "projectId": "007",
      "projectAbstract": "The aim of this project is to create a chatbot that will provide users with helpful information and assistance on a variety of topics."
    },
    {
      "projectTitle": "Developing a Fitness App",
      "projectId": "008",
      "projectAbstract": "This project involves building a fitness app that will allow users to track their workouts, set fitness goals, and monitor their progress over time."
    },
    {
      "projectTitle": "Designing a Food Delivery App",
      "projectId": "009",
      "projectAbstract": "In this project, we will be designing and developing a food delivery app that will allow users to order food from their favorite restaurants and have it delivered to their door."
    },
    {
      "projectTitle": "Building a Chatbot",
      "projectId": "007",
      "projectAbstract": "The aim of this project is to create a chatbot that will provide users with helpful information and assistance on a variety of topics."
    },
    {
      "projectTitle": "Developing a Fitness App",
      "projectId": "008",
      "projectAbstract": "This project involves building a fitness app that will allow users to track their workouts, set fitness goals, and monitor their progress over time."
    },
    {
      "projectTitle": "Designing a Food Delivery App",
      "projectId": "009",
      "projectAbstract": "In this project, we will be designing and developing a food delivery app that will allow users to order food from their favorite restaurants and have it delivered to their door."
    },
    {
      "projectTitle": "Developing a Smart Home System",
      "projectId": "001",
      "projectAbstract": "The aim of this project is to design and implement a smart home system that will allow users to control their home appliances and devices through a mobile app or voice commands."
    },
    {
      "projectTitle": "Creating a Social Networking Platform",
      "projectId": "002",
      "projectAbstract": "This project involves the development of a social networking platform that will allow users to connect with each other, share photos and videos, and post updates about their lives."
    },
    {
      "projectTitle": "Designing a Website for a Local Business",
      "projectId": "003",
      "projectAbstract": "In this project, we will be designing a website for a local business that will provide information about the services they offer, their hours of operation, and their contact information."
    },
    {
      "projectTitle": "Building a Personal Finance App",
      "projectId": "004",
      "projectAbstract": "The goal of this project is to develop a personal finance app that will help users track their spending, set savings goals, and manage their investments."
    },
    {
      "projectTitle": "Developing an E-commerce Platform",
      "projectId": "005",
      "projectAbstract": "This project involves building an e-commerce platform that will allow users to browse and purchase products online, as well as manage their orders and payments."
    },
    {
      "projectTitle": "Creating a Mobile Game",
      "projectId": "006",
      "projectAbstract": "In this project, we will be designing and developing a mobile game that will provide an engaging and entertaining experience for users."
    },
    {
      "projectTitle": "Building a Chatbot",
      "projectId": "007",
      "projectAbstract": "The aim of this project is to create a chatbot that will provide users with helpful information and assistance on a variety of topics."
    },
    {
      "projectTitle": "Developing a Fitness App",
      "projectId": "008",
      "projectAbstract": "This project involves building a fitness app that will allow users to track their workouts, set fitness goals, and monitor their progress over time."
    },
    {
      "projectTitle": "Designing a Food Delivery App",
      "projectId": "009",
      "projectAbstract": "In this project, we will be designing and developing a food delivery app that will allow users to order food from their favorite restaurants and have it delivered to their door."
    },
    {
      "projectTitle": "Building a Recommendation Engine",
      "projectId": "010",
      "projectAbstract": "The goal of this project is to build a recommendation engine that will provide users with personalized recommendations for products, services, and content based on their preferences and behavior."
    },
    {
      "projectTitle": "Building a Chatbot",
      "projectId": "007",
      "projectAbstract": "The aim of this project is to create a chatbot that will provide users with helpful information and assistance on a variety of topics."
    },
    {
      "projectTitle": "Developing a Fitness App",
      "projectId": "008",
      "projectAbstract": "This project involves building a fitness app that will allow users to track their workouts, set fitness goals, and monitor their progress over time."
    },
    {
      "projectTitle": "Designing a Food Delivery App",
      "projectId": "009",
      "projectAbstract": "In this project, we will be designing and developing a food delivery app that will allow users to order food from their favorite restaurants and have it delivered to their door."
    },
    {
      "projectTitle": "Building a Chatbot",
      "projectId": "007",
      "projectAbstract": "The aim of this project is to create a chatbot that will provide users with helpful information and assistance on a variety of topics."
    },
    {
      "projectTitle": "Developing a Fitness App",
      "projectId": "008",
      "projectAbstract": "This project involves building a fitness app that will allow users to track their workouts, set fitness goals, and monitor their progress over time."
    },
    {
      "projectTitle": "Designing a Food Delivery App",
      "projectId": "009",
      "projectAbstract": "In this project, we will be designing and developing a food delivery app that will allow users to order food from their favorite restaurants and have it delivered to their door."
    },
    {
      "projectTitle": "Building a Chatbot",
      "projectId": "007",
      "projectAbstract": "The aim of this project is to create a chatbot that will provide users with helpful information and assistance on a variety of topics."
    },
    {
      "projectTitle": "Developing a Fitness App",
      "projectId": "008",
      "projectAbstract": "This project involves building a fitness app that will allow users to track their workouts, set fitness goals, and monitor their progress over time."
    },
    {
      "projectTitle": "Designing a Food Delivery App",
      "projectId": "009",
      "projectAbstract": "In this project, we will be designing and developing a food delivery app that will allow users to order food from their favorite restaurants and have it delivered to their door."
    },
    {
      "projectTitle": "Building a Chatbot",
      "projectId": "007",
      "projectAbstract": "The aim of this project is to create a chatbot that will provide users with helpful information and assistance on a variety of topics."
    },
    {
      "projectTitle": "Developing a Fitness App",
      "projectId": "008",
      "projectAbstract": "This project involves building a fitness app that will allow users to track their workouts, set fitness goals, and monitor their progress over time."
    },
    {
      "projectTitle": "Designing a Food Delivery App",
      "projectId": "009",
      "projectAbstract": "In this project, we will be designing and developing a food delivery app that will allow users to order food from their favorite restaurants and have it delivered to their door."
    },
    {
      "projectTitle": "Developing a Smart Home System",
      "projectId": "001",
      "projectAbstract": "The aim of this project is to design and implement a smart home system that will allow users to control their home appliances and devices through a mobile app or voice commands."
    },
    {
      "projectTitle": "Creating a Social Networking Platform",
      "projectId": "002",
      "projectAbstract": "This project involves the development of a social networking platform that will allow users to connect with each other, share photos and videos, and post updates about their lives."
    },
    {
      "projectTitle": "Designing a Website for a Local Business",
      "projectId": "003",
      "projectAbstract": "In this project, we will be designing a website for a local business that will provide information about the services they offer, their hours of operation, and their contact information."
    },
    {
      "projectTitle": "Building a Personal Finance App",
      "projectId": "004",
      "projectAbstract": "The goal of this project is to develop a personal finance app that will help users track their spending, set savings goals, and manage their investments."
    },
    {
      "projectTitle": "Developing an E-commerce Platform",
      "projectId": "005",
      "projectAbstract": "This project involves building an e-commerce platform that will allow users to browse and purchase products online, as well as manage their orders and payments."
    },
    {
      "projectTitle": "Creating a Mobile Game",
      "projectId": "006",
      "projectAbstract": "In this project, we will be designing and developing a mobile game that will provide an engaging and entertaining experience for users."
    },
    {
      "projectTitle": "Building a Chatbot",
      "projectId": "007",
      "projectAbstract": "The aim of this project is to create a chatbot that will provide users with helpful information and assistance on a variety of topics."
    },
    {
      "projectTitle": "Developing a Fitness App",
      "projectId": "008",
      "projectAbstract": "This project involves building a fitness app that will allow users to track their workouts, set fitness goals, and monitor their progress over time."
    },
    {
      "projectTitle": "Designing a Food Delivery App",
      "projectId": "009",
      "projectAbstract": "In this project, we will be designing and developing a food delivery app that will allow users to order food from their favorite restaurants and have it delivered to their door."
    },
    {
      "projectTitle": "Building a Recommendation Engine",
      "projectId": "010",
      "projectAbstract": "The goal of this project is to build a recommendation engine that will provide users with personalized recommendations for products, services, and content based on their preferences and behavior."
    },
    {
      "projectTitle": "Building a Chatbot",
      "projectId": "007",
      "projectAbstract": "The aim of this project is to create a chatbot that will provide users with helpful information and assistance on a variety of topics."
    },
    {
      "projectTitle": "Developing a Fitness App",
      "projectId": "008",
      "projectAbstract": "This project involves building a fitness app that will allow users to track their workouts, set fitness goals, and monitor their progress over time."
    },
    {
      "projectTitle": "Designing a Food Delivery App",
      "projectId": "009",
      "projectAbstract": "In this project, we will be designing and developing a food delivery app that will allow users to order food from their favorite restaurants and have it delivered to their door."
    },
    {
      "projectTitle": "Building a Chatbot",
      "projectId": "007",
      "projectAbstract": "The aim of this project is to create a chatbot that will provide users with helpful information and assistance on a variety of topics."
    },
    {
      "projectTitle": "Developing a Fitness App",
      "projectId": "008",
      "projectAbstract": "This project involves building a fitness app that will allow users to track their workouts, set fitness goals, and monitor their progress over time."
    },
    {
      "projectTitle": "Designing a Food Delivery App",
      "projectId": "009",
      "projectAbstract": "In this project, we will be designing and developing a food delivery app that will allow users to order food from their favorite restaurants and have it delivered to their door."
    },
    {
      "projectTitle": "Building a Chatbot",
      "projectId": "007",
      "projectAbstract": "The aim of this project is to create a chatbot that will provide users with helpful information and assistance on a variety of topics."
    },
    {
      "projectTitle": "Developing a Fitness App",
      "projectId": "008",
      "projectAbstract": "This project involves building a fitness app that will allow users to track their workouts, set fitness goals, and monitor their progress over time."
    },
    {
      "projectTitle": "Designing a Food Delivery App",
      "projectId": "009",
      "projectAbstract": "In this project, we will be designing and developing a food delivery app that will allow users to order food from their favorite restaurants and have it delivered to their door."
    },
    {
      "projectTitle": "Building a Chatbot",
      "projectId": "007",
      "projectAbstract": "The aim of this project is to create a chatbot that will provide users with helpful information and assistance on a variety of topics."
    },
    {
      "projectTitle": "Developing a Fitness App",
      "projectId": "008",
      "projectAbstract": "This project involves building a fitness app that will allow users to track their workouts, set fitness goals, and monitor their progress over time."
    },
    {
      "projectTitle": "Designing a Food Delivery App",
      "projectId": "009",
      "projectAbstract": "In this project, we will be designing and developing a food delivery app that will allow users to order food from their favorite restaurants and have it delivered to their door."
    },
  ]



  const projectsDomain2 = [
    {
      "projectTitle": "Developing a Smart Home System",
      "projectId": "001",
      "projectAbstract": "The aim of this project is to design and implement a smart home system that will allow users to control their home appliances and devices through a mobile app or voice commands."
    },
    {
      "projectTitle": "Creating a Social Networking Platform",
      "projectId": "002",
      "projectAbstract": "This project involves the development of a social networking platform that will allow users to connect with each other, share photos and videos, and post updates about their lives."
    },
    {
      "projectTitle": "Designing a Website for a Local Business",
      "projectId": "003",
      "projectAbstract": "In this project, we will be designing a website for a local business that will provide information about the services they offer, their hours of operation, and their contact information."
    },
    {
      "projectTitle": "Building a Personal Finance App",
      "projectId": "004",
      "projectAbstract": "The goal of this project is to develop a personal finance app that will help users track their spending, set savings goals, and manage their investments."
    },
    {
      "projectTitle": "Developing an E-commerce Platform",
      "projectId": "005",
      "projectAbstract": "This project involves building an e-commerce platform that will allow users to browse and purchase products online, as well as manage their orders and payments."
    },
    {
      "projectTitle": "Creating a Mobile Game",
      "projectId": "006",
      "projectAbstract": "In this project, we will be designing and developing a mobile game that will provide an engaging and entertaining experience for users."
    },
    {
      "projectTitle": "Building a Chatbot",
      "projectId": "007",
      "projectAbstract": "The aim of this project is to create a chatbot that will provide users with helpful information and assistance on a variety of topics."
    },
    {
      "projectTitle": "Developing a Fitness App",
      "projectId": "008",
      "projectAbstract": "This project involves building a fitness app that will allow users to track their workouts, set fitness goals, and monitor their progress over time."
    },
    {
      "projectTitle": "Designing a Food Delivery App",
      "projectId": "009",
      "projectAbstract": "In this project, we will be designing and developing a food delivery app that will allow users to order food from their favorite restaurants and have it delivered to their door."
    },
    {
      "projectTitle": "Building a Recommendation Engine",
      "projectId": "010",
      "projectAbstract": "The goal of this project is to build a recommendation engine that will provide users with personalized recommendations for products, services, and content based on their preferences and behavior."
    },
    {
      "projectTitle": "Building a Chatbot",
      "projectId": "007",
      "projectAbstract": "The aim of this project is to create a chatbot that will provide users with helpful information and assistance on a variety of topics."
    },
    {
      "projectTitle": "Developing a Fitness App",
      "projectId": "008",
      "projectAbstract": "This project involves building a fitness app that will allow users to track their workouts, set fitness goals, and monitor their progress over time."
    },
    {
      "projectTitle": "Designing a Food Delivery App",
      "projectId": "009",
      "projectAbstract": "In this project, we will be designing and developing a food delivery app that will allow users to order food from their favorite restaurants and have it delivered to their door."
    },
    {
      "projectTitle": "Building a Chatbot",
      "projectId": "007",
      "projectAbstract": "The aim of this project is to create a chatbot that will provide users with helpful information and assistance on a variety of topics."
    },
    {
      "projectTitle": "Developing a Fitness App",
      "projectId": "008",
      "projectAbstract": "This project involves building a fitness app that will allow users to track their workouts, set fitness goals, and monitor their progress over time."
    },
    {
      "projectTitle": "Designing a Food Delivery App",
      "projectId": "009",
      "projectAbstract": "In this project, we will be designing and developing a food delivery app that will allow users to order food from their favorite restaurants and have it delivered to their door."
    },
    {
      "projectTitle": "Building a Chatbot",
      "projectId": "007",
      "projectAbstract": "The aim of this project is to create a chatbot that will provide users with helpful information and assistance on a variety of topics."
    },
    {
      "projectTitle": "Developing a Fitness App",
      "projectId": "008",
      "projectAbstract": "This project involves building a fitness app that will allow users to track their workouts, set fitness goals, and monitor their progress over time."
    },
    {
      "projectTitle": "Designing a Food Delivery App",
      "projectId": "009",
      "projectAbstract": "In this project, we will be designing and developing a food delivery app that will allow users to order food from their favorite restaurants and have it delivered to their door."
    },
    {
      "projectTitle": "Building a Chatbot",
      "projectId": "007",
      "projectAbstract": "The aim of this project is to create a chatbot that will provide users with helpful information and assistance on a variety of topics."
    },
    {
      "projectTitle": "Developing a Fitness App",
      "projectId": "008",
      "projectAbstract": "This project involves building a fitness app that will allow users to track their workouts, set fitness goals, and monitor their progress over time."
    },
    {
      "projectTitle": "Designing a Food Delivery App",
      "projectId": "009",
      "projectAbstract": "In this project, we will be designing and developing a food delivery app that will allow users to order food from their favorite restaurants and have it delivered to their door."
    },
    {
      "projectTitle": "Developing a Smart Home System",
      "projectId": "001",
      "projectAbstract": "The aim of this project is to design and implement a smart home system that will allow users to control their home appliances and devices through a mobile app or voice commands."
    },
    {
      "projectTitle": "Creating a Social Networking Platform",
      "projectId": "002",
      "projectAbstract": "This project involves the development of a social networking platform that will allow users to connect with each other, share photos and videos, and post updates about their lives."
    },
    {
      "projectTitle": "Designing a Website for a Local Business",
      "projectId": "003",
      "projectAbstract": "In this project, we will be designing a website for a local business that will provide information about the services they offer, their hours of operation, and their contact information."
    },
    {
      "projectTitle": "Building a Personal Finance App",
      "projectId": "004",
      "projectAbstract": "The goal of this project is to develop a personal finance app that will help users track their spending, set savings goals, and manage their investments."
    },
    {
      "projectTitle": "Developing an E-commerce Platform",
      "projectId": "005",
      "projectAbstract": "This project involves building an e-commerce platform that will allow users to browse and purchase products online, as well as manage their orders and payments."
    },
    {
      "projectTitle": "Creating a Mobile Game",
      "projectId": "006",
      "projectAbstract": "In this project, we will be designing and developing a mobile game that will provide an engaging and entertaining experience for users."
    },
    {
      "projectTitle": "Building a Chatbot",
      "projectId": "007",
      "projectAbstract": "The aim of this project is to create a chatbot that will provide users with helpful information and assistance on a variety of topics."
    },
    {
      "projectTitle": "Developing a Fitness App",
      "projectId": "008",
      "projectAbstract": "This project involves building a fitness app that will allow users to track their workouts, set fitness goals, and monitor their progress over time."
    },
    {
      "projectTitle": "Designing a Food Delivery App",
      "projectId": "009",
      "projectAbstract": "In this project, we will be designing and developing a food delivery app that will allow users to order food from their favorite restaurants and have it delivered to their door."
    },
    {
      "projectTitle": "Building a Recommendation Engine",
      "projectId": "010",
      "projectAbstract": "The goal of this project is to build a recommendation engine that will provide users with personalized recommendations for products, services, and content based on their preferences and behavior."
    },
    {
      "projectTitle": "Building a Chatbot",
      "projectId": "007",
      "projectAbstract": "The aim of this project is to create a chatbot that will provide users with helpful information and assistance on a variety of topics."
    },
    {
      "projectTitle": "Developing a Fitness App",
      "projectId": "008",
      "projectAbstract": "This project involves building a fitness app that will allow users to track their workouts, set fitness goals, and monitor their progress over time."
    },
    {
      "projectTitle": "Designing a Food Delivery App",
      "projectId": "009",
      "projectAbstract": "In this project, we will be designing and developing a food delivery app that will allow users to order food from their favorite restaurants and have it delivered to their door."
    },
    {
      "projectTitle": "Building a Chatbot",
      "projectId": "007",
      "projectAbstract": "The aim of this project is to create a chatbot that will provide users with helpful information and assistance on a variety of topics."
    },
    {
      "projectTitle": "Developing a Fitness App",
      "projectId": "008",
      "projectAbstract": "This project involves building a fitness app that will allow users to track their workouts, set fitness goals, and monitor their progress over time."
    },
    {
      "projectTitle": "Designing a Food Delivery App",
      "projectId": "009",
      "projectAbstract": "In this project, we will be designing and developing a food delivery app that will allow users to order food from their favorite restaurants and have it delivered to their door."
    },
    {
      "projectTitle": "Building a Chatbot",
      "projectId": "007",
      "projectAbstract": "The aim of this project is to create a chatbot that will provide users with helpful information and assistance on a variety of topics."
    },
    {
      "projectTitle": "Developing a Fitness App",
      "projectId": "008",
      "projectAbstract": "This project involves building a fitness app that will allow users to track their workouts, set fitness goals, and monitor their progress over time."
    },
    {
      "projectTitle": "Designing a Food Delivery App",
      "projectId": "009",
      "projectAbstract": "In this project, we will be designing and developing a food delivery app that will allow users to order food from their favorite restaurants and have it delivered to their door."
    },
    {
      "projectTitle": "Building a Chatbot",
      "projectId": "007",
      "projectAbstract": "The aim of this project is to create a chatbot that will provide users with helpful information and assistance on a variety of topics."
    },
    {
      "projectTitle": "Developing a Fitness App",
      "projectId": "008",
      "projectAbstract": "This project involves building a fitness app that will allow users to track their workouts, set fitness goals, and monitor their progress over time."
    },
    {
      "projectTitle": "Designing a Food Delivery App",
      "projectId": "009",
      "projectAbstract": "In this project, we will be designing and developing a food delivery app that will allow users to order food from their favorite restaurants and have it delivered to their door."
    },
    {
      "projectTitle": "Developing a Smart Home System",
      "projectId": "001",
      "projectAbstract": "The aim of this project is to design and implement a smart home system that will allow users to control their home appliances and devices through a mobile app or voice commands."
    },
    {
      "projectTitle": "Creating a Social Networking Platform",
      "projectId": "002",
      "projectAbstract": "This project involves the development of a social networking platform that will allow users to connect with each other, share photos and videos, and post updates about their lives."
    },
    {
      "projectTitle": "Designing a Website for a Local Business",
      "projectId": "003",
      "projectAbstract": "In this project, we will be designing a website for a local business that will provide information about the services they offer, their hours of operation, and their contact information."
    },
    {
      "projectTitle": "Building a Personal Finance App",
      "projectId": "004",
      "projectAbstract": "The goal of this project is to develop a personal finance app that will help users track their spending, set savings goals, and manage their investments."
    },
    {
      "projectTitle": "Developing an E-commerce Platform",
      "projectId": "005",
      "projectAbstract": "This project involves building an e-commerce platform that will allow users to browse and purchase products online, as well as manage their orders and payments."
    },
    {
      "projectTitle": "Creating a Mobile Game",
      "projectId": "006",
      "projectAbstract": "In this project, we will be designing and developing a mobile game that will provide an engaging and entertaining experience for users."
    },
    {
      "projectTitle": "Building a Chatbot",
      "projectId": "007",
      "projectAbstract": "The aim of this project is to create a chatbot that will provide users with helpful information and assistance on a variety of topics."
    },
    {
      "projectTitle": "Developing a Fitness App",
      "projectId": "008",
      "projectAbstract": "This project involves building a fitness app that will allow users to track their workouts, set fitness goals, and monitor their progress over time."
    },
    {
      "projectTitle": "Designing a Food Delivery App",
      "projectId": "009",
      "projectAbstract": "In this project, we will be designing and developing a food delivery app that will allow users to order food from their favorite restaurants and have it delivered to their door."
    },
    {
      "projectTitle": "Building a Recommendation Engine",
      "projectId": "010",
      "projectAbstract": "The goal of this project is to build a recommendation engine that will provide users with personalized recommendations for products, services, and content based on their preferences and behavior."
    },
    {
      "projectTitle": "Building a Chatbot",
      "projectId": "007",
      "projectAbstract": "The aim of this project is to create a chatbot that will provide users with helpful information and assistance on a variety of topics."
    },
    {
      "projectTitle": "Developing a Fitness App",
      "projectId": "008",
      "projectAbstract": "This project involves building a fitness app that will allow users to track their workouts, set fitness goals, and monitor their progress over time."
    },
    {
      "projectTitle": "Designing a Food Delivery App",
      "projectId": "009",
      "projectAbstract": "In this project, we will be designing and developing a food delivery app that will allow users to order food from their favorite restaurants and have it delivered to their door."
    },
    {
      "projectTitle": "Building a Chatbot",
      "projectId": "007",
      "projectAbstract": "The aim of this project is to create a chatbot that will provide users with helpful information and assistance on a variety of topics."
    },
    {
      "projectTitle": "Developing a Fitness App",
      "projectId": "008",
      "projectAbstract": "This project involves building a fitness app that will allow users to track their workouts, set fitness goals, and monitor their progress over time."
    },
    {
      "projectTitle": "Designing a Food Delivery App",
      "projectId": "009",
      "projectAbstract": "In this project, we will be designing and developing a food delivery app that will allow users to order food from their favorite restaurants and have it delivered to their door."
    },
    {
      "projectTitle": "Building a Chatbot",
      "projectId": "007",
      "projectAbstract": "The aim of this project is to create a chatbot that will provide users with helpful information and assistance on a variety of topics."
    },
    {
      "projectTitle": "Developing a Fitness App",
      "projectId": "008",
      "projectAbstract": "This project involves building a fitness app that will allow users to track their workouts, set fitness goals, and monitor their progress over time."
    },
    {
      "projectTitle": "Designing a Food Delivery App",
      "projectId": "009",
      "projectAbstract": "In this project, we will be designing and developing a food delivery app that will allow users to order food from their favorite restaurants and have it delivered to their door."
    },
    {
      "projectTitle": "Building a Chatbot",
      "projectId": "007",
      "projectAbstract": "The aim of this project is to create a chatbot that will provide users with helpful information and assistance on a variety of topics."
    },
    {
      "projectTitle": "Developing a Fitness App",
      "projectId": "008",
      "projectAbstract": "This project involves building a fitness app that will allow users to track their workouts, set fitness goals, and monitor their progress over time."
    },
    {
      "projectTitle": "Designing a Food Delivery App",
      "projectId": "009",
      "projectAbstract": "In this project, we will be designing and developing a food delivery app that will allow users to order food from their favorite restaurants and have it delivered to their door."
    },
    {
      "projectTitle": "Developing a Smart Home System",
      "projectId": "001",
      "projectAbstract": "The aim of this project is to design and implement a smart home system that will allow users to control their home appliances and devices through a mobile app or voice commands."
    },
    {
      "projectTitle": "Creating a Social Networking Platform",
      "projectId": "002",
      "projectAbstract": "This project involves the development of a social networking platform that will allow users to connect with each other, share photos and videos, and post updates about their lives."
    },
    {
      "projectTitle": "Designing a Website for a Local Business",
      "projectId": "003",
      "projectAbstract": "In this project, we will be designing a website for a local business that will provide information about the services they offer, their hours of operation, and their contact information."
    },
    {
      "projectTitle": "Building a Personal Finance App",
      "projectId": "004",
      "projectAbstract": "The goal of this project is to develop a personal finance app that will help users track their spending, set savings goals, and manage their investments."
    },
    {
      "projectTitle": "Developing an E-commerce Platform",
      "projectId": "005",
      "projectAbstract": "This project involves building an e-commerce platform that will allow users to browse and purchase products online, as well as manage their orders and payments."
    },
    {
      "projectTitle": "Creating a Mobile Game",
      "projectId": "006",
      "projectAbstract": "In this project, we will be designing and developing a mobile game that will provide an engaging and entertaining experience for users."
    },
    {
      "projectTitle": "Building a Chatbot",
      "projectId": "007",
      "projectAbstract": "The aim of this project is to create a chatbot that will provide users with helpful information and assistance on a variety of topics."
    },
    {
      "projectTitle": "Developing a Fitness App",
      "projectId": "008",
      "projectAbstract": "This project involves building a fitness app that will allow users to track their workouts, set fitness goals, and monitor their progress over time."
    },
    {
      "projectTitle": "Designing a Food Delivery App",
      "projectId": "009",
      "projectAbstract": "In this project, we will be designing and developing a food delivery app that will allow users to order food from their favorite restaurants and have it delivered to their door."
    },
    {
      "projectTitle": "Building a Recommendation Engine",
      "projectId": "010",
      "projectAbstract": "The goal of this project is to build a recommendation engine that will provide users with personalized recommendations for products, services, and content based on their preferences and behavior."
    },
    {
      "projectTitle": "Building a Chatbot",
      "projectId": "007",
      "projectAbstract": "The aim of this project is to create a chatbot that will provide users with helpful information and assistance on a variety of topics."
    },
    {
      "projectTitle": "Developing a Fitness App",
      "projectId": "008",
      "projectAbstract": "This project involves building a fitness app that will allow users to track their workouts, set fitness goals, and monitor their progress over time."
    },
    {
      "projectTitle": "Designing a Food Delivery App",
      "projectId": "009",
      "projectAbstract": "In this project, we will be designing and developing a food delivery app that will allow users to order food from their favorite restaurants and have it delivered to their door."
    },
    {
      "projectTitle": "Building a Chatbot",
      "projectId": "007",
      "projectAbstract": "The aim of this project is to create a chatbot that will provide users with helpful information and assistance on a variety of topics."
    },
    {
      "projectTitle": "Developing a Fitness App",
      "projectId": "008",
      "projectAbstract": "This project involves building a fitness app that will allow users to track their workouts, set fitness goals, and monitor their progress over time."
    },
    {
      "projectTitle": "Designing a Food Delivery App",
      "projectId": "009",
      "projectAbstract": "In this project, we will be designing and developing a food delivery app that will allow users to order food from their favorite restaurants and have it delivered to their door."
    },
    {
      "projectTitle": "Building a Chatbot",
      "projectId": "007",
      "projectAbstract": "The aim of this project is to create a chatbot that will provide users with helpful information and assistance on a variety of topics."
    },
    {
      "projectTitle": "Developing a Fitness App",
      "projectId": "008",
      "projectAbstract": "This project involves building a fitness app that will allow users to track their workouts, set fitness goals, and monitor their progress over time."
    },
    {
      "projectTitle": "Designing a Food Delivery App",
      "projectId": "009",
      "projectAbstract": "In this project, we will be designing and developing a food delivery app that will allow users to order food from their favorite restaurants and have it delivered to their door."
    },
    {
      "projectTitle": "Building a Chatbot",
      "projectId": "007",
      "projectAbstract": "The aim of this project is to create a chatbot that will provide users with helpful information and assistance on a variety of topics."
    },
    {
      "projectTitle": "Developing a Fitness App",
      "projectId": "008",
      "projectAbstract": "This project involves building a fitness app that will allow users to track their workouts, set fitness goals, and monitor their progress over time."
    },
    {
      "projectTitle": "Designing a Food Delivery App",
      "projectId": "009",
      "projectAbstract": "In this project, we will be designing and developing a food delivery app that will allow users to order food from their favorite restaurants and have it delivered to their door."
    },
    {
      "projectTitle": "Developing a Smart Home System",
      "projectId": "001",
      "projectAbstract": "The aim of this project is to design and implement a smart home system that will allow users to control their home appliances and devices through a mobile app or voice commands."
    },
    {
      "projectTitle": "Creating a Social Networking Platform",
      "projectId": "002",
      "projectAbstract": "This project involves the development of a social networking platform that will allow users to connect with each other, share photos and videos, and post updates about their lives."
    },
    {
      "projectTitle": "Designing a Website for a Local Business",
      "projectId": "003",
      "projectAbstract": "In this project, we will be designing a website for a local business that will provide information about the services they offer, their hours of operation, and their contact information."
    },
    {
      "projectTitle": "Building a Personal Finance App",
      "projectId": "004",
      "projectAbstract": "The goal of this project is to develop a personal finance app that will help users track their spending, set savings goals, and manage their investments."
    },
    {
      "projectTitle": "Developing an E-commerce Platform",
      "projectId": "005",
      "projectAbstract": "This project involves building an e-commerce platform that will allow users to browse and purchase products online, as well as manage their orders and payments."
    },
    {
      "projectTitle": "Creating a Mobile Game",
      "projectId": "006",
      "projectAbstract": "In this project, we will be designing and developing a mobile game that will provide an engaging and entertaining experience for users."
    },
    {
      "projectTitle": "Building a Chatbot",
      "projectId": "007",
      "projectAbstract": "The aim of this project is to create a chatbot that will provide users with helpful information and assistance on a variety of topics."
    },
    {
      "projectTitle": "Developing a Fitness App",
      "projectId": "008",
      "projectAbstract": "This project involves building a fitness app that will allow users to track their workouts, set fitness goals, and monitor their progress over time."
    },
    {
      "projectTitle": "Designing a Food Delivery App",
      "projectId": "009",
      "projectAbstract": "In this project, we will be designing and developing a food delivery app that will allow users to order food from their favorite restaurants and have it delivered to their door."
    },
    {
      "projectTitle": "Building a Recommendation Engine",
      "projectId": "010",
      "projectAbstract": "The goal of this project is to build a recommendation engine that will provide users with personalized recommendations for products, services, and content based on their preferences and behavior."
    },
    {
      "projectTitle": "Building a Chatbot",
      "projectId": "007",
      "projectAbstract": "The aim of this project is to create a chatbot that will provide users with helpful information and assistance on a variety of topics."
    },
    {
      "projectTitle": "Developing a Fitness App",
      "projectId": "008",
      "projectAbstract": "This project involves building a fitness app that will allow users to track their workouts, set fitness goals, and monitor their progress over time."
    },
    {
      "projectTitle": "Designing a Food Delivery App",
      "projectId": "009",
      "projectAbstract": "In this project, we will be designing and developing a food delivery app that will allow users to order food from their favorite restaurants and have it delivered to their door."
    },
    {
      "projectTitle": "Building a Chatbot",
      "projectId": "007",
      "projectAbstract": "The aim of this project is to create a chatbot that will provide users with helpful information and assistance on a variety of topics."
    },
    {
      "projectTitle": "Developing a Fitness App",
      "projectId": "008",
      "projectAbstract": "This project involves building a fitness app that will allow users to track their workouts, set fitness goals, and monitor their progress over time."
    },
    {
      "projectTitle": "Designing a Food Delivery App",
      "projectId": "009",
      "projectAbstract": "In this project, we will be designing and developing a food delivery app that will allow users to order food from their favorite restaurants and have it delivered to their door."
    },
    {
      "projectTitle": "Building a Chatbot",
      "projectId": "007",
      "projectAbstract": "The aim of this project is to create a chatbot that will provide users with helpful information and assistance on a variety of topics."
    },
    {
      "projectTitle": "Developing a Fitness App",
      "projectId": "008",
      "projectAbstract": "This project involves building a fitness app that will allow users to track their workouts, set fitness goals, and monitor their progress over time."
    },
    {
      "projectTitle": "Designing a Food Delivery App",
      "projectId": "009",
      "projectAbstract": "In this project, we will be designing and developing a food delivery app that will allow users to order food from their favorite restaurants and have it delivered to their door."
    },
    {
      "projectTitle": "Building a Chatbot",
      "projectId": "007",
      "projectAbstract": "The aim of this project is to create a chatbot that will provide users with helpful information and assistance on a variety of topics."
    },
    {
      "projectTitle": "Developing a Fitness App",
      "projectId": "008",
      "projectAbstract": "This project involves building a fitness app that will allow users to track their workouts, set fitness goals, and monitor their progress over time."
    },
    {
      "projectTitle": "Designing a Food Delivery App",
      "projectId": "009",
      "projectAbstract": "In this project, we will be designing and developing a food delivery app that will allow users to order food from their favorite restaurants and have it delivered to their door."
    },
    {
      "projectTitle": "Developing a Smart Home System",
      "projectId": "001",
      "projectAbstract": "The aim of this project is to design and implement a smart home system that will allow users to control their home appliances and devices through a mobile app or voice commands."
    },
    {
      "projectTitle": "Creating a Social Networking Platform",
      "projectId": "002",
      "projectAbstract": "This project involves the development of a social networking platform that will allow users to connect with each other, share photos and videos, and post updates about their lives."
    },
    {
      "projectTitle": "Designing a Website for a Local Business",
      "projectId": "003",
      "projectAbstract": "In this project, we will be designing a website for a local business that will provide information about the services they offer, their hours of operation, and their contact information."
    },
    {
      "projectTitle": "Building a Personal Finance App",
      "projectId": "004",
      "projectAbstract": "The goal of this project is to develop a personal finance app that will help users track their spending, set savings goals, and manage their investments."
    },
    {
      "projectTitle": "Developing an E-commerce Platform",
      "projectId": "005",
      "projectAbstract": "This project involves building an e-commerce platform that will allow users to browse and purchase products online, as well as manage their orders and payments."
    },
    {
      "projectTitle": "Creating a Mobile Game",
      "projectId": "006",
      "projectAbstract": "In this project, we will be designing and developing a mobile game that will provide an engaging and entertaining experience for users."
    },
    {
      "projectTitle": "Building a Chatbot",
      "projectId": "007",
      "projectAbstract": "The aim of this project is to create a chatbot that will provide users with helpful information and assistance on a variety of topics."
    },
    {
      "projectTitle": "Developing a Fitness App",
      "projectId": "008",
      "projectAbstract": "This project involves building a fitness app that will allow users to track their workouts, set fitness goals, and monitor their progress over time."
    },
    {
      "projectTitle": "Designing a Food Delivery App",
      "projectId": "009",
      "projectAbstract": "In this project, we will be designing and developing a food delivery app that will allow users to order food from their favorite restaurants and have it delivered to their door."
    },
    {
      "projectTitle": "Building a Recommendation Engine",
      "projectId": "010",
      "projectAbstract": "The goal of this project is to build a recommendation engine that will provide users with personalized recommendations for products, services, and content based on their preferences and behavior."
    },
    {
      "projectTitle": "Building a Chatbot",
      "projectId": "007",
      "projectAbstract": "The aim of this project is to create a chatbot that will provide users with helpful information and assistance on a variety of topics."
    },
    {
      "projectTitle": "Developing a Fitness App",
      "projectId": "008",
      "projectAbstract": "This project involves building a fitness app that will allow users to track their workouts, set fitness goals, and monitor their progress over time."
    },
    {
      "projectTitle": "Designing a Food Delivery App",
      "projectId": "009",
      "projectAbstract": "In this project, we will be designing and developing a food delivery app that will allow users to order food from their favorite restaurants and have it delivered to their door."
    },
    {
      "projectTitle": "Building a Chatbot",
      "projectId": "007",
      "projectAbstract": "The aim of this project is to create a chatbot that will provide users with helpful information and assistance on a variety of topics."
    },
    {
      "projectTitle": "Developing a Fitness App",
      "projectId": "008",
      "projectAbstract": "This project involves building a fitness app that will allow users to track their workouts, set fitness goals, and monitor their progress over time."
    },
    {
      "projectTitle": "Designing a Food Delivery App",
      "projectId": "009",
      "projectAbstract": "In this project, we will be designing and developing a food delivery app that will allow users to order food from their favorite restaurants and have it delivered to their door."
    },
    {
      "projectTitle": "Building a Chatbot",
      "projectId": "007",
      "projectAbstract": "The aim of this project is to create a chatbot that will provide users with helpful information and assistance on a variety of topics."
    },
    {
      "projectTitle": "Developing a Fitness App",
      "projectId": "008",
      "projectAbstract": "This project involves building a fitness app that will allow users to track their workouts, set fitness goals, and monitor their progress over time."
    },
    {
      "projectTitle": "Designing a Food Delivery App",
      "projectId": "009",
      "projectAbstract": "In this project, we will be designing and developing a food delivery app that will allow users to order food from their favorite restaurants and have it delivered to their door."
    },
    {
      "projectTitle": "Building a Chatbot",
      "projectId": "007",
      "projectAbstract": "The aim of this project is to create a chatbot that will provide users with helpful information and assistance on a variety of topics."
    },
    {
      "projectTitle": "Developing a Fitness App",
      "projectId": "008",
      "projectAbstract": "This project involves building a fitness app that will allow users to track their workouts, set fitness goals, and monitor their progress over time."
    },
    {
      "projectTitle": "Designing a Food Delivery App",
      "projectId": "009",
      "projectAbstract": "In this project, we will be designing and developing a food delivery app that will allow users to order food from their favorite restaurants and have it delivered to their door."
    },
  ]

export {
    roles,
    groupLinks,
    officialEmails,
    projects,
    projectsDomain2,
    whatsappLinks,
}