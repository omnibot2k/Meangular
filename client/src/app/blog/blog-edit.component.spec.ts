/* tslint:disable:no-unused-variable */

import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { BlogEditComponent } from './blog-edit.component';
import { BlogService } from './blog.service';

const blogEntryStub = {
  title: 'Test blog entry',
  content: 'Test content',
  created: new Date(),
  _id: 'objectid',
  user: {
    profile: {
      name: 'Test User'
    },
    _id: 'objectid'
  }
};
let fixture;
let component;

describe('BlogEditComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule
      ],
      declarations: [
        BlogEditComponent
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {blogEntry: blogEntryStub}
            }
          }
        },
        {
          provide: BlogService,
          useValue: {
            updateBlogEntry: (blogEntry) => blogEntry
          }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
    TestBed.compileComponents();
    fixture = TestBed.createComponent(BlogEditComponent);
    component = fixture.debugElement.componentInstance;
  });

  it('loads the blog edit component', () => {
    expect(component).toBeTruthy();
  });

  it('initializes with blog entry from route resolve', () => {
    component.ngOnInit();
    expect(component.blogEntry).toEqual(blogEntryStub);
  });

  it('creates a blogEditForm FormGroup', () => {
    component.ngOnInit();
    expect(component.blogEditForm instanceof FormGroup).toBe(true);
  });

  it('initializes form with blog entry', () => {
    component.ngOnInit();
    expect(component.blogEditForm.value).toEqual({
        title: blogEntryStub.title,
        content: blogEntryStub.content
      });
  });

  it('calls BlogService editBlogEntry method for component method', () => {
    const blogService = TestBed.get(BlogService);
    component.ngOnInit();
    spyOn(blogService, 'updateBlogEntry');
    component.editBlogEntry();
    expect(blogService.updateBlogEntry)
      .toHaveBeenCalledWith({
        title: blogEntryStub.title,
        content: blogEntryStub.content,
        _id: blogEntryStub._id
      });
  });

  describe('#canDeactivate', () => {
    beforeEach(() => {
      // Mock confirm so test can proceed without interaction
      // Simulates user clicking cancel on browser confirm prompt
      spyOn(window, 'confirm').and.returnValue(false);
      component.ngOnInit();
    });

    it('allows deactivation if inputs are unchanged', () => {
      expect(component.canDeactivate()).toBe(true);
    });

    it('disallows deactivation if inputs are changed but blog entry not edited',
       () => {
      const title = 'changed title';
      const content = 'changed content';
      component.blogEditForm.patchValue({content, title});
      expect(component.canDeactivate()).toBe(false);
    });

    it('allows deactivation if inputs changed & blog entry is edited', () => {
      const title = 'changed title';
      const content = 'changed content';
      component.blogEditForm.patchValue({content, title});
      component.editBlogEntry();
      expect(component.canDeactivate()).toBe(true);
    });
  });
});
