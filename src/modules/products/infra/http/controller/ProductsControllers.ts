import { container } from "tsyringe";
import CreateProductService from "@modules/products/services/CreateProductService";
import DeleteProductService from "@modules/products/services/DeleteProductService";
import ListProductService from "@modules/products/services/ListProductService";
import ShowProductService from "@modules/products/services/ShowProductService";
import UpdateProductService from "@modules/products/services/UpdateProductService";
import { Request, Response } from "express";


export default class ProductsControllers {
  async index(request: Request, response: Response): Promise<Response> {
    const { page = 1, skip = 0, take = 10 } = request.query;
    const listProductsService = container.resolve(ListProductService);
    const products = await listProductsService.execute({
      page: Number(page),
      skip: Number(skip),
      take: Number(take)
    });
    return response.json(products);
  }

  async show(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const showProductService = container.resolve(ShowProductService);
    const product = await showProductService.execute({ id: Number(id) });
    return response.json(product);
  }

  async create(request: Request, response: Response): Promise<Response> {
    const { name, price, quantity } = request.body;
    const createProductService = container.resolve(CreateProductService);
    const product = await createProductService.execute({
      name,
      price: Number(price),
      quantity: Number(quantity)
    });
    return response.json(product);
  }

  async update(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const { name, price, quantity } = request.body;
    const updateProductService = container.resolve(UpdateProductService);
    const product = await updateProductService.execute({
      id: Number(id),
      name,
      price: Number(price),
      quantity: Number(quantity)
    });
    return response.json(product);
  }

  async delete(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const deleteProductService = container.resolve(DeleteProductService);
    await deleteProductService.execute({ id: Number(id) });
    return response.status(204).send([]);
  }
}
