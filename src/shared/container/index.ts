import { container } from 'tsyringe';
import CustomersRepository from '@modules/customers/infra/database/repositories/CustomerRepositories';
import { ICustomersRepository } from '@modules/customers/domain/repositories/ICustomersRepositories';
import { IOrdersRepository } from '@modules/orders/domain/repositories/IOrdersRepository';
import OrdersRepository from '@modules/orders/infra/database/repositories/OrderRepositories';
import { IProductsRepository } from '@modules/products/domain/repositories/IProductsRepository';
import { ProductsRepository } from '@modules/products/infra/database/repositories/ProductsRepositories';
import { IUserRepositories } from '@modules/users/domain/repositories/IUserRepositories';
import { UsersRepositories } from '@modules/users/infra/database/repositories/UsersRepositories';
import { IUserTokenRepositories } from '@modules/users/domain/repositories/IUserTokenRepositories';
import { UserTokensRepositories } from '@modules/users/infra/database/repositories/UserTokensRepositories';

container.registerSingleton<ICustomersRepository>(
  'CustomersRepository',
  CustomersRepository
)

container.registerSingleton<IOrdersRepository>(
  'OrdersRepository',
  OrdersRepository
)

container.registerSingleton<IProductsRepository>(
  'ProductsRepository',
  ProductsRepository
)

container.registerSingleton<IUserRepositories>(
  'UsersRepositories',
  UsersRepositories
)

container.registerSingleton<IUserTokenRepositories>(
  'UserTokensRepositories',
  UserTokensRepositories
)
