import { v4 as UUID } from 'uuid';

/**
 * Interfaces
 */
interface Props {
  id?: string;
  name: string;
};

interface ListInterface extends Props {
  timestamp: number;
};

/**
 * class ListModel
 */
export default class ListModel {
  private id: string;
  private name: string;

  constructor({ id = UUID(), name = '' }: Props) {
    this.id = id;
    this.name = name;
  };

  /**
   * Set id
   * @param value
   */
  setId(value: string) {
    this.id = value !== '' ? value : null;
  };

  /**
   * Get id
   * @return {string|*}
   */
  getId() {
    return this.id;
  };

  /**
   * Set name
   * @param value
   */
  setName(value: string) {
    this.name = value !== '' ? value : null;
  };

  /**
   * Get name
   * @return {string|*}
   */
  getName() {
    return this.name;
  };

  /**
   * Get base entity mappings
   * @return {ListInterface}
   */
  getEntityMappings(): ListInterface {
    return {
      id: this.getId(),
      name: this.getName(),
      timestamp: new Date().getTime(),
    };
  };
};
