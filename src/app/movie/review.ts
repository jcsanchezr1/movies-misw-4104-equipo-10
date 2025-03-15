export class Review {

    id: string;
    text: string;
    score: number;
    creator: string;

    constructor(
        id: string,
        text: string,
        score: number,
        creator: string,
    ) {
        this.id = id,
        this.text = text,
        this.score = score,
        this.creator = creator
    }

}
