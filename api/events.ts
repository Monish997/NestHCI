import data from './data/events.json';

type NestEvent = {
    id: number;
    name: string;
    date: string;  // or Date if you are working with actual Date objects
    fromTime: string;
    toTime: string;
    latitude: number;
    longitude: number;
    city: string;
    locationName: string;
    description: string;
    interested: number;
    going: number;
    organiser: {
        id: number;
        username: string;
    };
    thumbnail: string;
    media: string[];
};


function getEvents() {
    return data;
}

function getEventById(id: number) {
    return data.find(event => event.id === id);
}

function getEventsByCity(city: string) {
    return data.filter(event => event.city === city);
}

export { getEventById, getEvents, getEventsByCity };

