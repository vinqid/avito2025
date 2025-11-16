import { test, expect } from '@playwright/test';

test.describe('E2E тесты Task Tracker - Полные сценарии с доской', () => {
  const BASE_URL = 'https://avito-tech-internship-psi.vercel.app/';

  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
  });

  // ============================================================================
  // E2E-001: Создание → Открытие карточки → Переход на доску через кнопку
  // ============================================================================

  test('E2E-001: Создать задачу, открыть карточку и перейти на доску через кнопку', async ({ page }) => {
    // ШАГ 1: Создаем задачу
    const создатьЗадачу = page.locator('button:has-text("СОЗДАТЬ ЗАДАЧУ"), button:has-text("Создать задачу")').first();
    await создатьЗадачу.click();
    await page.waitForTimeout(1000);

    const полеНазвание = page.locator('input[placeholder*="Название" i]').first();
    await полеНазвание.fill('Интеграция с CI/CD');

    const полеОписание = page.locator('textarea, [placeholder*="Описание" i]').first();
    await полеОписание.fill('Интеграция тестов в процесс разработки. Детали будут уточнены в процессе разработки.');

    const проектSelect = page.locator('text=/Проект \\*/i').first().locator('xpath=../..').locator('[role="combobox"], select').first();
    await проектSelect.click();
    await page.waitForTimeout(300);
    const проектОпция = page.locator('text=Автоматизация тестирования').first();
    await проектОпция.click();

    const приоритетSelect = page.locator('text=/Приоритет \\*/i').first().locator('xpath=../..').locator('[role="combobox"], select').first();
    await приоритетSelect.click();
    await page.waitForTimeout(300);
    const приоритетОпция = page.locator('text=High').first();
    await приоритетОпция.click();

    const исполнительSelect = page.locator('text=/Исполнитель \\*/i').first().locator('xpath=../..').locator('[role="combobox"], select').first();
    await исполнительSelect.click();
    await page.waitForTimeout(300);
    const исполнительОпция = page.locator('text=Артем Белов').first();
    await исполнительОпция.click();

    const кнопкаСоздать = page.locator('button:has-text("СОЗДАТЬ"), button:has-text("Создать")').last();
    await кнопкаСоздать.click();
    await page.waitForTimeout(1500);

    // ШАГ 2: Открываем созданную задачу
    const созданнаяЗадача = page.locator('text=Интеграция с CI/CD').first();
    await созданнаяЗадача.click();
    await page.waitForTimeout(1000);

    // ШАГ 3: Проверяем что карточка открылась с полями
    await expect(page.locator('text=Интеграция с CI/CD')).toBeVisible();
    await expect(page.locator('text=Артем Белов')).toBeVisible();

    // ШАГ 4: Ищем и нажимаем кнопку "Перейти на доску"
    const кнопкаПеряйтиНаДоску = page.locator('button:has-text("Перейти на доску"), button:has-text("Go to board"), [class*="board"]').first();
    
    const видимаКнопка = await кнопкаПеряйтиНаДоску.isVisible({ timeout: 2000 }).catch(() => false);
    expect(видимаКнопка).toBeTruthy('Кнопка "Перейти на доску" должна быть видна в карточке');

    await кнопкаПеряйтиНаДоску.click();
    await page.waitForTimeout(1500);

    // ШАГ 5: Проверяем что открылась доска проекта
    await expect(page.locator('text=To Do, In Progress, Done').locator('...')).toBeVisible();
    await expect(page.locator('text=To Do')).toBeVisible();
    await expect(page.locator('text=In Progress')).toBeVisible();
    await expect(page.locator('text=Done')).toBeVisible();

    // ШАГ 6: Проверяем что наша задача видна на доске
    const задачаНаДоске = page.locator('text=Интеграция с CI/CD').first();
    await expect(задачаНаДоске).toBeVisible();

    // ШАГ 7: Проверяем что она в колонке "To Do" (Backlog)
    const задачаВТоДо = page.locator('text=To Do').first().locator('xpath=..').locator('text=Интеграция с CI/CD').first();
    await expect(задачаВТоДо).toBeVisible();
  });

  // ============================================================================
  // E2E-002: Карточка → Доска → Перемещение → Возврат в карточку
  // ============================================================================

  test('E2E-002: Из карточки на доску, переместить задачу, и проверить обновление статуса', async ({ page }) => {
    // ШАГ 1: Создаем задачу
    const создатьЗадачу = page.locator('button:has-text("СОЗДАТЬ ЗАДАЧУ"), button:has-text("Создать задачу")').first();
    await создатьЗадачу.click();
    await page.waitForTimeout(1000);

    const полеНазвание = page.locator('input[placeholder*="Название" i]').first();
    await полеНазвание.fill('Написание E2E тестов');

    const полеОписание = page.locator('textarea, [placeholder*="Описание" i]').first();
    await полеОписание.fill('Создание автоматических тестов для критического функционала.');

    const проектSelect = page.locator('text=/Проект \\*/i').first().locator('xpath=../..').locator('[role="combobox"], select').first();
    await проектSelect.click();
    await page.waitForTimeout(300);
    const проектОпция = page.locator('text=Автоматизация тестирования').first();
    await проектОпция.click();

    const приоритетSelect = page.locator('text=/Приоритет \\*/i').first().locator('xpath=../..').locator('[role="combobox"], select').first();
    await приоритетSelect.click();
    await page.waitForTimeout(300);
    const приоритетОпция = page.locator('text=Medium').first();
    await приоритетОпция.click();

    const исполнительSelect = page.locator('text=/Исполнитель \\*/i').first().locator('xpath=../..').locator('[role="combobox"], select').first();
    await исполнительSelect.click();
    await page.waitForTimeout(300);
    const исполнительОпция = page.locator('text=Олега Новикова').first();
    await исполнительОпция.click();

    const кнопкаСоздать = page.locator('button:has-text("СОЗДАТЬ"), button:has-text("Создать")').last();
    await кнопкаСоздать.click();
    await page.waitForTimeout(1500);

    // ШАГ 2: Открываем карточку
    const задача = page.locator('text=Написание E2E тестов').first();
    await задача.click();
    await page.waitForTimeout(1000);

    // ШАГ 3: Проверяем статус в карточке (Backlog)
    const статусВКарточке = page.locator('text=Backlog, InProgress, Done').locator('..').locator('text=Backlog').first();
    await expect(статусВКарточке).toBeVisible();

    // ШАГ 4: Переходим на доску через кнопку
    const кнопкаПеряйтиНаДоску = page.locator('button:has-text("Перейти на доску"), button:has-text("Go to board")').first();
    await кнопкаПеряйтиНаДоску.click();
    await page.waitForTimeout(1500);

    // ШАГ 5: Перемещаем задачу из To Do в In Progress
    const задачаНаДоске = page.locator('text=Написание E2E тестов').first();
    const колонкаInProgress = page.locator('text=In Progress').first().locator('xpath=..').locator('[class*="column"], [class*="list"]').first();
    await задачаНаДоске.dragTo(колонкаInProgress);
    await page.waitForTimeout(1500);

    // ШАГ 6: Проверяем что задача переместилась
    const задачаВInProgress = page.locator('text=In Progress').first().locator('xpath=..').locator('text=Написание E2E тестов').first();
    await expect(задачаВInProgress).toBeVisible();

    // ШАГ 7: Открываем задачу и проверяем что статус обновился
    await задачаВInProgress.click();
    await page.waitForTimeout(1000);

    const статусInProgress = page.locator('text=InProgress').first();
    await expect(статусInProgress).toBeVisible();
  });

  // ============================================================================
  // E2E-003: Карточка → Доска → Перемещение в Done → Проверка статуса
  // ============================================================================

  test('E2E-003: Открыть карточку, перейти на доску, переместить в Done', async ({ page }) => {
    // ШАГ 1: Создаем задачу
    const создатьЗадачу = page.locator('button:has-text("СОЗДАТЬ ЗАДАЧУ"), button:has-text("Создать задачу")').first();
    await создатьЗадачу.click();
    await page.waitForTimeout(1000);

    const полеНазвание = page.locator('input[placeholder*="Название" i]').first();
    await полеНазвание.fill('Интеграция с Allure отчетностью');

    const полеОписание = page.locator('textarea, [placeholder*="Описание" i]').first();
    await полеОписание.fill('Интеграция тестов в процесс разработки. Детали будут уточнены в процессе разработки.');

    const проектSelect = page.locator('text=/Проект \\*/i').first().locator('xpath=../..').locator('[role="combobox"], select').first();
    await проектSelect.click();
    await page.waitForTimeout(300);
    const проектОпция = page.locator('text=Автоматизация тестирования').first();
    await проектОпция.click();

    const приоритетSelect = page.locator('text=/Приоритет \\*/i').first().locator('xpath=../..').locator('[role="combobox"], select').first();
    await приоритетSelect.click();
    await page.waitForTimeout(300);
    const приоритетОпция = page.locator('text=Low').first();
    await приоритетОпция.click();

    const исполнительSelect = page.locator('text=/Исполнитель \\*/i').first().locator('xpath=../..').locator('[role="combobox"], select').first();
    await исполнительSelect.click();
    await page.waitForTimeout(300);
    const исполнительОпция = page.locator('text=Артем Белов').first();
    await исполнительОпция.click();

    const кнопкаСоздать = page.locator('button:has-text("СОЗДАТЬ"), button:has-text("Создать")').last();
    await кнопкаСоздать.click();
    await page.waitForTimeout(1500);

    // ШАГ 2: Открываем карточку созданной задачи
    const задача = page.locator('text=Интеграция с Allure отчетностью').first();
    await задача.click();
    await page.waitForTimeout(1000);

    // ШАГ 3: Переходим на доску через кнопку
    const кнопкаПеряйтиНаДоску = page.locator('button:has-text("Перейти на доску"), button:has-text("Go to board")').first();
    await кнопкаПеряйтиНаДоску.click();
    await page.waitForTimeout(1500);

    // ШАГ 4: Перемещаем задачу напрямую из To Do в Done
    const задачаНаДоске = page.locator('text=Интеграция с Allure отчетностью').first();
    const колонкаDone = page.locator('text=Done').first().locator('xpath=..').locator('[class*="column"], [class*="list"]').first();
    await задачаНаДоске.dragTo(колонкаDone);
    await page.waitForTimeout(1500);

    // ШАГ 5: Проверяем что задача в Done
    const задачаВDone = page.locator('text=Done').first().locator('xpath=..').locator('text=Интеграция с Allure отчетностью').first();
    await expect(задачаВDone).toBeVisible();

    // ШАГ 6: Открываем задачу и проверяем финальный статус
    await задачаВDone.click();
    await page.waitForTimeout(1000);

    const статусDone = page.locator('text=Done').first();
    await expect(статусDone).toBeVisible();
  });

  // ============================================================================
  // E2E-004: Редактирование в карточке → Переход на доску → Проверка
  // ============================================================================

  test('E2E-004: Отредактировать карточку, перейти на доску, проверить данные', async ({ page }) => {
    // ШАГ 1: Создаем задачу
    const создатьЗадачу = page.locator('button:has-text("СОЗДАТЬ ЗАДАЧУ"), button:has-text("Создать задачу")').first();
    await создатьЗадачу.click();
    await page.waitForTimeout(1000);

    const полеНазвание = page.locator('input[placeholder*="Название" i]').first();
    await полеНазвание.fill('Реализация тестов безопасности');

    const полеОписание = page.locator('textarea, [placeholder*="Описание" i]').first();
    await полеОписание.fill('Интеграция тестов в процесс разработки.');

    const проектSelect = page.locator('text=/Проект \\*/i').first().locator('xpath=../..').locator('[role="combobox"], select').first();
    await проектSelect.click();
    await page.waitForTimeout(300);
    const проектОпция = page.locator('text=Автоматизация тестирования').first();
    await проектОпция.click();

    const приоритетSelect = page.locator('text=/Приоритет \\*/i').first().locator('xpath=../..').locator('[role="combobox"], select').first();
    await приоритетSelect.click();
    await page.waitForTimeout(300);
    const приоритетОпция = page.locator('text=Medium').first();
    await приоритетОпция.click();

    const исполнительSelect = page.locator('text=/Исполнитель \\*/i').first().locator('xpath=../..').locator('[role="combobox"], select').first();
    await исполнительSelect.click();
    await page.waitForTimeout(300);
    const исполнительОпция = page.locator('text=Максим Орлов').first();
    await исполнительОпция.click();

    const кнопкаСоздать = page.locator('button:has-text("СОЗДАТЬ"), button:has-text("Создать")').last();
    await кнопкаСоздать.click();
    await page.waitForTimeout(1500);

    // ШАГ 2: Открываем карточку
    const задача = page.locator('text=Реализация тестов безопасности').first();
    await задача.click();
    await page.waitForTimeout(1000);

    // ШАГ 3: Редактируем карточку
    const кнопкаРедактировать = page.locator('button:has-text("Edit"), [title*="Edit"], [class*="edit"]').first();
    const видимаРедактирование = await кнопкаРедактировать.isVisible({ timeout: 1000 }).catch(() => false);

    if (видимаРедактирование) {
      await кнопкаРедактировать.click();
      await page.waitForTimeout(500);

      const названиеДляРедактирования = page.locator('input[value*="Реализация тестов безопасности"]').first();
      await названиеДляРедактирования.clear();
      await названиеДляРедактирования.fill('Реализация тестов безопасности (УСКОРЕННАЯ)');

      const кнопкаСохранить = page.locator('button:has-text("Сохранить"), button:has-text("Save")').first();
      await кнопкаСохранить.click({ timeout: 2000 }).catch(() => {
        // Может быть автосохранение
      });

      await page.waitForTimeout(1000);
    }

    // ШАГ 4: Переходим на доску через кнопку
    const кнопкаПеряйтиНаДоску = page.locator('button:has-text("Перейти на доску"), button:has-text("Go to board")').first();
    await кнопкаПеряйтиНаДоску.click();
    await page.waitForTimeout(1500);

    // ШАГ 5: Проверяем что задача на доске с обновленным названием
    const задачаНаДоске = page.locator('text=Реализация тестов безопасности (УСКОРЕННАЯ)').first();
    await expect(задачаНаДоске).toBeVisible();
  });

  // ============================================================================
  // E2E-005: Несколько задач → Открыть каждую → Перейти на доску → Проверить
  // ============================================================================

  test('E2E-005: Несколько задач, открыть каждую, перейти на доску и проверить позицию', async ({ page }) => {
    // ШАГ 1: Создаем три задачи
    const задачиДанные = [
      { название: 'Создание tests', приоритет: 'Low', исполнитель: 'Артем Белов' },
      { название: 'Интеграция с Allure', приоритет: 'Medium', исполнитель: 'Олега Новикова' },
      { название: 'Реализация тестов', приоритет: 'High', исполнитель: 'Максим Орлов' }
    ];

    for (const данные of задачиДанные) {
      const создатьЗадачу = page.locator('button:has-text("СОЗДАТЬ ЗАДАЧУ"), button:has-text("Создать задачу")').first();
      await создатьЗадачу.click();
      await page.waitForTimeout(1000);

      const полеНазвание = page.locator('input[placeholder*="Название" i]').first();
      await полеНазвание.fill(данные.название);

      const полеОписание = page.locator('textarea, [placeholder*="Описание" i]').first();
      await полеОписание.fill('Тестовое описание');

      const проектSelect = page.locator('text=/Проект \\*/i').first().locator('xpath=../..').locator('[role="combobox"], select').first();
      await проектSelect.click();
      await page.waitForTimeout(300);
      const проектОпция = page.locator('text=Автоматизация тестирования').first();
      await проектОпция.click();

      const приоритетSelect = page.locator('text=/Приоритет \\*/i').first().locator('xpath=../..').locator('[role="combobox"], select').first();
      await приоритетSelect.click();
      await page.waitForTimeout(300);
      const приоритетОпция = page.locator(`text=${данные.приоритет}`).first();
      await приоритетОпция.click();

      const исполнительSelect = page.locator('text=/Исполнитель \\*/i').first().locator('xpath=../..').locator('[role="combobox"], select').first();
      await исполнительSelect.click();
      await page.waitForTimeout(300);
      const исполнительОпция = page.locator(`text=${данные.исполнитель}`).first();
      await исполнительОпция.click();

      const кнопкаСоздать = page.locator('button:has-text("СОЗДАТЬ"), button:has-text("Создать")').last();
      await кнопкаСоздать.click();
      await page.waitForTimeout(1500);
    }

    // ШАГ 2: Открываем первую задачу
    const перваяЗадача = page.locator('text=Создание tests').first();
    await перваяЗадача.click();
    await page.waitForTimeout(1000);

    // ШАГ 3: Переходим на доску
    const кнопкаПеряйтиНаДоску1 = page.locator('button:has-text("Перейти на доску"), button:has-text("Go to board")').first();
    await кнопкаПеряйтиНаДоску1.click();
    await page.waitForTimeout(1500);

    // ШАГ 4: Проверяем что видны все три задачи на доске
    const все_три_задачи = await page.locator('text=/Создание tests|Интеграция с Allure|Реализация тестов/').count();
    expect(все_три_задачи).toBeGreaterThanOrEqual(3);

    // ШАГ 5: Перемещаем первую в In Progress
    const перваяНаДоске = page.locator('text=Создание tests').first();
    const колонкаInProgress = page.locator('text=In Progress').first().locator('xpath=..').locator('[class*="column"], [class*="list"]').first();
    await перваяНаДоске.dragTo(колонкаInProgress);
    await page.waitForTimeout(1500);

    // ШАГ 6: Перемещаем вторую в Done
    const втораяНаДоске = page.locator('text=Интеграция с Allure').first();
    const колонкаDone = page.locator('text=Done').first().locator('xpath=..').locator('[class*="column"], [class*="list"]').first();
    await втораяНаДоске.dragTo(колонкаDone);
    await page.waitForTimeout(1500);

    // ШАГ 7: Проверяем позиции всех трех
    const перваяВInProgress = page.locator('text=In Progress').first().locator('xpath=..').locator('text=Создание tests').first();
    await expect(перваяВInProgress).toBeVisible();

    const втораяВDone = page.locator('text=Done').first().locator('xpath=..').locator('text=Интеграция с Allure').first();
    await expect(втораяВDone).toBeVisible();

    const третьяВТоДо = page.locator('text=To Do').first().locator('xpath=..').locator('text=Реализация тестов').first();
    await expect(третьяВТоДо).toBeVisible();

    // ШАГ 8: Открываем первую и проверяем статус
    await перваяВInProgress.click();
    await page.waitForTimeout(1000);

    const статусInProgress = page.locator('text=InProgress').first();
    await expect(статусInProgress).toBeVisible();
  });
});
