import { browser, element, by, Key } from 'protractor';

import { UserPage } from '../user/user.po';
import { AppPage } from '../app.po';

describe('BlogCreate component', () => {
  let userPage: UserPage;
  let appPage: AppPage;
  let titleInput;
  let contentInput;
  let submitBtn;
  let body;

  beforeAll(() => {
    userPage = new UserPage();
    appPage = new AppPage();
    body = element(by.css('body'));
  });

  describe('creation', () => {
    beforeAll(() => {
      userPage.login('help@greenpioneersolutions.com', 'truetrue1!');
      browser.get('/blog/create');
      titleInput = element(by.id('title'));
      contentInput = element(by.name('content'));
      submitBtn = element(by.css('[type="submit"]'));
    });

    it('successfully creates blog entry', () => {
      titleInput.sendKeys('new');
      contentInput.sendKeys('new');
      submitBtn.click();
      expect(element(by.id('blogEntryContent')).getText()).toBe('new');
    });
  });

  describe('title validation', () => {
    let formGroup;
    let warningSpan;

    beforeAll(() => {
      userPage.login('help@greenpioneersolutions.com', 'truetrue1!');
      browser.get('/blog/create');
      titleInput = element(by.id('title'));
      formGroup = titleInput.element(by.xpath('..'));
    });

    describe('required', () => {
      beforeAll(() => {
        titleInput.clear();
        titleInput.sendKeys('ta')
        titleInput.clear();
        titleInput.click();
        titleInput.sendKeys('j')
        titleInput.sendKeys(Key.BACK_SPACE);
        body.click();
      });

      beforeEach(() => {
         warningSpan = formGroup.element(by.css('span'));
      });

      afterAll(() => {
        // Enter keys so this input's invalidity doesn't affect content test's
        titleInput.sendKeys('thing');
      });

      it('has validation style', () => {
        expect(formGroup.getAttribute('class')).toMatch('has-error');
      });

      it('has correct text warning', () => {
        expect(warningSpan.isPresent()).toBe(true);
        expect(warningSpan.isDisplayed()).toBe(true);
        expect(warningSpan.getText()).toBe('Title is required');
      });

      it('submit button is disabled', () => {
        appPage.expectSubmitEnabledStateToBe(false);
      });
    });
  });

  describe('content validation', () => {
    let formGroup;
    let warningSpan;

    beforeAll(() => {
      contentInput = element(by.id('content'));
      formGroup = contentInput.element(by.xpath('..'));
    });

    describe('required', () => {
      beforeAll(() => {
        contentInput.clear();
        contentInput.click();
        contentInput.sendKeys('j')
        contentInput.sendKeys(Key.BACK_SPACE);
        body.click();
      });

      beforeEach(() => {
         warningSpan = formGroup.element(by.css('span'));
      });

      it('has validation style', () => {
        expect(formGroup.getAttribute('class')).toMatch(/has-error/);
      });

      it('has correct text warning', () => {
        expect(warningSpan.isPresent()).toBe(true);
        expect(warningSpan.isDisplayed()).toBe(true);
        expect(warningSpan.getText()).toBe('Content is required');
      });

      it('submit button is disabled', () => {
        appPage.expectSubmitEnabledStateToBe(false);
      });
    });
  });
});
