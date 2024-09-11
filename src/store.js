/**
 * Хранилище состояния приложения
 */
class Store {
  constructor(initState = {}) {
    this.state = initState;
    this.listeners = []; // Слушатели изменений состояния
    this.codeCounter = this.getMaxCode() + 1; // Уникальный счетчик для кодов
  }

  /**
   * Получаем максимальный код из существующих записей
   * для правильного старта счетчика уникальных кодов
   */
  getMaxCode() {
    return this.state.list.length ? Math.max(...this.state.list.map(item => item.code)) : 0;
  }

  /**
   * Подписка слушателя на изменения состояния
   * @param listener {Function}
   * @returns {Function} Функция отписки
   */
  subscribe(listener) {
    this.listeners.push(listener);
    // Возвращается функция для удаления добавленного слушателя
    return () => {
      this.listeners = this.listeners.filter(item => item !== listener);
    };
  }

  /**
   * Выбор состояния
   * @returns {Object}
   */
  getState() {
    return this.state;
  }

  /**
   * Установка состояния
   * @param newState {Object}
   */
  setState(newState) {
    this.state = newState;
    // Вызываем всех слушателей
    for (const listener of this.listeners) listener();
  }

  /**
   * Генерация уникального кода
   * @returns {number}
   */
  generateUniqueCode() {
    return this.codeCounter++;
  }

  /**
   * Добавление новой записи
   */
  addItem() {
    const newCode = this.generateUniqueCode();
    this.setState({
      ...this.state,
      list: [
        ...this.state.list,
        { code: newCode, title: `Новая запись ${newCode}`, selectedCount: 0, selected: false },
      ],
    });
  }

  /**
   * Удаление записи по коду
   * @param code
   */
  deleteItem(code) {
    this.setState({
      ...this.state,
      list: this.state.list.filter(item => item.code !== code),
    });
  }

  /**
   * Выделение записи по коду
   * @param code
   */
  selectItem(code) {
    this.setState({
      ...this.state,
      list: this.state.list.map(item => {
        // Если элемент выбран — снимаем выделение, иначе выделяем его
        if (item.code === code) {
          return {
            ...item,
            selected: !item.selected,
            selectedCount: !item.selected ? (item.selectedCount || 0) + 1 : item.selectedCount,
          };
        }
        return { ...item, selected: false };
      }),
    });
  }
}

export default Store;
