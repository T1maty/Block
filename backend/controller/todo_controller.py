from sqlalchemy.orm import Session
from .. import models,schema


def create_todo(db:Session, data:schema.TodoCreate):
    todo = models.Todo(task=data.task, description=data.description, completed = data.completed)
    db.add(todo)
    db.commit()
    db.refresh(todo)
    return todo

def get_all_todos(db:Session):
    return db.query(models.Todo).all()



def get_one(db:Session, todo_id: int):
    return db.query(models.Todo).filter(models.Todo.id == todo_id).first()


def update(db: Session, todo_id: int, data: schema.TodoUpdate):
    todo = get_one(db, todo_id)
    if not todo:
        return None
    
    if data.task:
        todo.task = data.task

        if data.description:
            todo.description = data.description
        if data.completed is not None:
            todo.completed = data.completed
    
    db.commit()
    db.refresh(todo)
    return todo

def delete(db:Session, todo_id: int):
    todo = get_one(db, todo_id)
    if not todo:
        return None
    
    db.delete(todo)
    db.commit()
    return todo
    



