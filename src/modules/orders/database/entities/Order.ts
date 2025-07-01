import { Customer } from "@modules/customers/database/entities/Customer";
import { CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => Customer)
  @JoinColumn()
  customer: Customer

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date
}
