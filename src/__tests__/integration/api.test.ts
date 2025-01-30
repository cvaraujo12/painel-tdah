import { describe, expect, it, beforeAll, afterAll } from 'vitest'
import { createServer } from 'http'
import { apiResolver } from 'next/dist/server/api-utils/node'
import { GET, POST, PUT, DELETE } from '@/app/api/tasks/route'
import { prisma } from '@/lib/prisma'

describe('API de Tarefas - Testes de Integração', () => {
  const testTask = {
    title: 'Tarefa de Teste',
    description: 'Descrição de teste',
    priority: 'média',
    completed: false,
    tags: ['teste'],
  }

  beforeAll(async () => {
    // Limpa o banco de dados antes dos testes
    await prisma.task.deleteMany()
  })

  afterAll(async () => {
    // Limpa o banco de dados após os testes
    await prisma.task.deleteMany()
    await prisma.$disconnect()
  })

  it('deve listar tarefas', async () => {
    const req = {
      method: 'GET',
      headers: {},
    } as Request

    const response = await GET(req)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(Array.isArray(data)).toBe(true)
  })

  it('deve criar uma tarefa', async () => {
    const req = new Request('http://localhost/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testTask),
    })

    const response = await POST(req)
    const data = await response.json()

    expect(response.status).toBe(201)
    expect(data.title).toBe(testTask.title)
    expect(data.id).toBeDefined()
  })

  it('deve atualizar uma tarefa', async () => {
    // Primeiro cria uma tarefa
    const createReq = new Request('http://localhost/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testTask),
    })
    const createResponse = await POST(createReq)
    const createdTask = await createResponse.json()

    // Depois atualiza a tarefa
    const updateData = {
      id: createdTask.id,
      title: 'Tarefa Atualizada',
    }

    const updateReq = new Request('http://localhost/api/tasks', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    })

    const response = await PUT(updateReq)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.title).toBe('Tarefa Atualizada')
  })

  it('deve deletar uma tarefa', async () => {
    // Primeiro cria uma tarefa
    const createReq = new Request('http://localhost/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testTask),
    })
    const createResponse = await POST(createReq)
    const createdTask = await createResponse.json()

    // Depois deleta a tarefa
    const deleteReq = new Request(
      `http://localhost/api/tasks?id=${createdTask.id}`,
      {
        method: 'DELETE',
      }
    )

    const response = await DELETE(deleteReq)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
  })
}) 