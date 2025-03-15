export class Trailer {

    id: string;
    name: string;
    url: string;
    duration: number;
    channel: string;

    constructor(
        id: string,
        name: string,
        url: string,
        duration: number,
        channel: string,
    ) {
        this.id = id,
        this.name = name,
        this.url = url,
        this.duration = duration,
        this.channel = channel
    }

}
