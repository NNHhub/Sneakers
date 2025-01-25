export interface ISneakers{
    id:number,
    name: string,
    color_id:number,
    color_name: string,
    price: number,
    main_picture: string
    pictures?: string[]
}