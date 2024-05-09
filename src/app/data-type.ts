export interface SignUp {
    name: string,
    password: string,
    email: string,
}

export interface Login {
    email: string,
    password: string
}

export interface Product {
    productName: string,
    productPrice: number,
    productColor: string,
    productCategory: string,
    productDescription: string,
    productImage: string,
    id: string,
    quantity: undefined | number,
    productId: string | undefined,
}

export interface Cart {
    productName: string,
    productPrice: number,
    productColor: string,
    productCategory: string,
    productDescription: string,
    productImage: string,
    id: string | undefined,
    quantity: undefined | number,
    userId: string,
    productId: string,
}

export interface PriceSummary {
    price: number,
    discount: number,
    tax: number,
    delivery: number,
    total: number,
}

export interface Order {
    email: string,
    address: string,
    contact: string,
    totalPrice: number,
    userId: string,
    id: string | undefined,
}