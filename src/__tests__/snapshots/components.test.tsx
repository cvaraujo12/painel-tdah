import { render } from '@testing-library/react'
import { TaskList } from '@/components/widgets/task-list'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

describe('Snapshot Tests', () => {
  it('TaskList deve manter aparência consistente', () => {
    const { container } = render(
      <TaskList />
    )
    expect(container).toMatchSnapshot()
  })

  it('Button deve manter estilos consistentes', () => {
    const { container } = render(
      <div>
        <Button variant="default">Default</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="link">Link</Button>
      </div>
    )
    expect(container).toMatchSnapshot()
  })

  it('Card deve manter layout consistente', () => {
    const { container } = render(
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold">Título do Card</h3>
          <p className="text-sm text-muted-foreground">
            Conteúdo de exemplo para o card
          </p>
          <div className="mt-4">
            <Button>Ação</Button>
          </div>
        </div>
      </Card>
    )
    expect(container).toMatchSnapshot()
  })

  it('Formulário deve manter estrutura consistente', () => {
    const { container } = render(
      <form className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
        <Button type="submit">Enviar</Button>
      </form>
    )
    expect(container).toMatchSnapshot()
  })
}) 