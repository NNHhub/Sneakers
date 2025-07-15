export interface ISneakers{
    id:number,
    name: string,
    sneaker_id:number,
    color_name: string,
    price: number,
    sizes?: { size:number,count:number }[],  
    description?: string,
    main_picture: string,
    pictures?: string[],
    size?:number,
    count?: number
}