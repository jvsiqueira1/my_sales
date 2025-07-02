import CreateProductService from "@modules/products/services/CreateProductService";
import DeleteProductService from "@modules/products/services/DeleteProductService";
import ListProductService from "@modules/products/services/ListProductService";
import ShowProductService from "@modules/products/services/ShowProductService";
import UpdateProductService from "@modules/products/services/UpdateProductService";
import { Request, Response } from "express";


export default class ProductsControllers {
  async index(_request: Request, response: Response): Promise<Response> {
    const listProductsService = new ListProductService()
    const products = await listProductsService.execute()
    return response.json(products)
  }

  async show(request: Request, response: Response): Promise<Response> {
    const { id } = request.params
    const showProductService = new ShowProductService()
    const product = await showProductService.execute({ id })
    return response.json(product)
  }

  async create(request: Request, response: Response): Promise<Response> {
    const { name, price, quantity } = request.body
    const createProductService = new CreateProductService()
    const product = await createProductService.execute({
      name,
      price,
      quantity
    })
    return response.json(product)
  }

  async update(request: Request, response: Response): Promise<Response> {
    const { id } = request.params
    const { name, price, quantity } = request.body
    const updateProductService = new UpdateProductService()
    const product = await updateProductService.execute({
      id,
      name,
      price,
      quantity
    })
    return response.json(product)
  }

  async delete(request: Request, response: Response): Promise<Response> {
    const { id } = request.params
    const deleteProductService = new DeleteProductService()
    await deleteProductService.execute({ id })
    return response.status(204).send([])
  }
}
