import { Movie } from "../movie/movie";

export class Review {

    id: string;
    text: string;
    creator: string;
    score: number;
    constructor(
        id: string,
        text: string,
        creator: string,
        score: number
    ) {
        this.id = id;
        this.text = text;
        this.creator = creator;
        this.score = score;
    }

}
