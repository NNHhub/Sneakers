import { Observable } from "rxjs";

export interface Paginator{
    length:number,
    itemPerPage:number,
    currentPage$:Observable <number>,
    page$:Observable<number[]>
}