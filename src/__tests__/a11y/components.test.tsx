import { render } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import { TaskList } from '@/components/widgets/task-list'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

expect.extend(toHaveNoViolations)

describe('Testes de Acessibilidade', () => {
  it('TaskList não deve ter violações de acessibilidade', async () => {
    const { container } = render(
      <TaskList />
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('Button deve ser acessível via teclado', async () => {
    const { container } = render(
      <Button>Teste</Button>
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('Input deve ter labels apropriados', async () => {
    const { container } = render(
      <div>
        <label htmlFor="test-input">Campo de teste</label>
        <Input id="test-input" aria-describedby="test-description" />
        <span id="test-description">Descrição do campo</span>
      </div>
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('Formulário deve ter estrutura semântica correta', async () => {
    const { container } = render(
      <form aria-label="Formulário de teste">
        <fieldset>
          <legend>Dados pessoais</legend>
          <div>
            <label htmlFor="name">Nome</label>
            <Input id="name" required />
          </div>
          <div>
            <label htmlFor="email">Email</label>
            <Input id="email" type="email" required />
          </div>
        </fieldset>
        <Button type="submit">Enviar</Button>
      </form>
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
}) 