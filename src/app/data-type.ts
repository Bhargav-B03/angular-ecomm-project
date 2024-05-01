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
    productImage: string
}