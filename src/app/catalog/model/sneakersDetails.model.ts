import { ISneakers } from "./sneaker.model"

export interface SneakersResponse{
    nextPageToken:number,
    items: ISneakers[]
}