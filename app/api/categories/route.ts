import { Category } from '@prisma/client'
import prisma from '../../../prisma/client'

export async function GET(request) {
  try {
    const searchParams = request.nextUrl.searchParams
    const web = searchParams.get('web')

    const categories: Category[] = await prisma.category.findMany({
      where: {
        web: {
          slug: {
            contains: web,
          },
        },
      },
      include: {
        listings: true,
      },
      orderBy: [
        {
          id: 'asc',
        },
      ],
    })

    return Response.json({ data: categories })
  } catch (e) {
    console.error(`[RW] Unable to fetch categories - ${e}`)
    return new Response(`Unable to fetch categories - ${e}`, {
      status: 500,
    })
  }
}

export async function POST(request: Request) {
  const body = await request.json()
  try {
    const category = await prisma.category.create({
      data: body,
    })

    return Response.json({ data: category })
  } catch (e) {
    console.error(`[RW] Unable to create category - ${e}`)
    return new Response(`Unable to create category - ${e}`, {
      status: 500,
    })
  }
}

export async function PATCH(request: Request) {
  const body = await request.json()

  try {
    const category = await prisma.category.update({
      where: {
        id: body.id,
      },
      data: body,
    })

    return Response.json({ data: category })
  } catch (e) {
    console.error(`[RW] Unable to update category - ${e}`)
    return new Response(`Unable to update category - ${e}`, {
      status: 500,
    })
  }
}
