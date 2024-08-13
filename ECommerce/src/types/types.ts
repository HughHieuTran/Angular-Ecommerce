export interface ProductQueryParams{
    limit?: number | 10; 
    offset?: number | 0; 
    name?: string; 
    minPrice?: number; 
    maxPrice?: number; 
}

export interface User {
    email: string;
    username?: string | undefined;
    password: string;
    orders: Order[];
}

export interface Product {
    id: number;
    name: string;
    sku?: string;
    trademark?: string;
    width?: number;
    length?: number;
    height?: number;
    manufacturer?: string;
    propertyName?: string;
    propertyValue?: string;
    rating: number;
    price: number;
    stock: number;
    image:string;
    orderItems: OrderItem[];
}

export interface Order {
    id: number;
    orderDate: string;
    user: User;
    orderItems: OrderItem[];
}

export interface OrderItem {
    id: number;
    order?: Order |undefined;
    product?: Product | undefined;
    quantity: number;
    totalPrice: number;
}