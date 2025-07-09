import { IOrderProducts } from "@modules/orders/domain/models/IOrderProducts"

export interface IProduct {
  id: number
  order_products?: IOrderProducts[]
  name: string
  price: number
  quantity: number
  created_at: Date
  updated_at: Date
}
