import { v4 as UUID } from 'uuid';

/**
 * Interfaces
 */
interface Props {
  id?: string;
  listId: string;
  description: string;
  completed: boolean;
}
interface TaskInterface extends Props {
  timestamp: number;
}

/**
 * class TaskModel
 */
export default class TaskModel {
  private id: string;
  private listId: string;
  private description: string;
  private completed: boolean;

  constructor({ id = UUID(), listId, description  = '', completed = false}: Props) {
    this.id = id;
    this.listId = listId;
    this.description = description;
    this.completed = completed;
  }

  /**
   * Set id
   * @param value
   */
  setId(value: string) {
    this.id = value !== '' ? value : null;
  }

  /**
   * Get Id
   * @return {string|*}
   */
  getId() {
    return this.id;
  }

  /**
   * Set list id
   * @param value
   */
  setListId(value: string) {
    this.listId = value !== '' ? value : null;
  }

  /**
   * Get list id
   * @return {string|*}
   */
  getListId() {
    return this.listId;
  }
  
  /**
   * Set description
   * @param value
   */
  setDescription(value: string) {
    this.description = value ? value : null;
  }

  /**
   * Get description
   * @return {string}
   */
  getDescription() {
    return this.description;
  }

  /**
   * Set completed
   * @param value
   */
  setCompleted(value: boolean) {
    this.completed = value ? value : null;
  }

  /**
   * Get completed
   * @return {boolean}
   */
  getCompleted() {
    return this.completed;
  }

  /**
   * Get base entity mappings
   * @return {TaskInterface}
   */
  getEntityMappings(): TaskInterface {
    return {
      id: this.getId(),
      listId: this.getListId(),
      description: this.getDescription(),
      completed: this.getCompleted(),
      timestamp: new Date().getTime(),
    };
  }
}