interface QueuedOperation {
  id: string;
  table: string;
  type: 'insert' | 'update' | 'delete';
  data: any;
  timestamp: number;
}

class OfflineQueue {
  private queue: QueuedOperation[] = [];
  private isProcessing = false;

  constructor() {
    this.loadQueue();
    window.addEventListener('online', () => this.processQueue());
  }

  private loadQueue() {
    const savedQueue = localStorage.getItem('offlineQueue');
    if (savedQueue) {
      this.queue = JSON.parse(savedQueue);
    }
  }

  private saveQueue() {
    localStorage.setItem('offlineQueue', JSON.stringify(this.queue));
  }

  addOperation(operation: Omit<QueuedOperation, 'id' | 'timestamp'>) {
    const queuedOp: QueuedOperation = {
      ...operation,
      id: crypto.randomUUID(),
      timestamp: Date.now()
    };

    this.queue.push(queuedOp);
    this.saveQueue();

    if (navigator.onLine) {
      this.processQueue();
    }
  }

  async processQueue() {
    if (this.isProcessing || this.queue.length === 0 || !navigator.onLine) {
      return;
    }

    this.isProcessing = true;

    try {
      const operations = [...this.queue];
      this.queue = [];
      this.saveQueue();

      for (const operation of operations) {
        try {
          // Aqui você implementaria a lógica para executar a operação
          // usando o Supabase ou qualquer outro cliente de banco de dados
          console.log('Processando operação:', operation);
        } catch (error) {
          // Se falhar, coloca de volta na fila
          this.queue.push(operation);
          this.saveQueue();
        }
      }
    } finally {
      this.isProcessing = false;
    }
  }

  getQueue(): QueuedOperation[] {
    return [...this.queue];
  }

  clearQueue() {
    this.queue = [];
    this.saveQueue();
  }
}

export const offlineQueue = new OfflineQueue(); 