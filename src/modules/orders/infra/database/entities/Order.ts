import { CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import { OrdersProducts } from "./OrdersProducts"
import { Customer } from "@modules/customers/infra/database/entities/Customer"

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => Customer)
  @JoinColumn({name: 'customer_id'})
  customer: Customer

  @OneToMany(() => OrdersProducts, order_products => order_products.order, {
    cascade: true,
  })
  order_products: OrdersProducts[]

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date
}
