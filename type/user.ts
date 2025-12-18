
export interface LoginType {
    email: string,
    password: string
}

export interface SignUpType extends LoginType {
    id: string
    firstName: string
    lastName: string
    role: "Admin" | "Customer"
}

export interface UserType extends SignUpType {
    userId: string,
    address: any[]
    mineProducts: any[],
    createdAt: Date | null
    updatedAt: Date | null
};