from datetime import date
from typing import Optional, List

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import SQLModel, Field, Session, create_engine, select

DB_URL = "sqlite:///./jobtracker.db"
engine = create_engine(DB_URL, echo=False)

class Application(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)

    company: str
    role_title: str
    city: Optional[str] = None
    work_mode: str = "Hybrid"  # Remote / Hybrid / Onsite

    status: str = "Applied"    # Applied / Screen / Interview / Offer / Rejected
    date_applied: Optional[date] = None
    last_follow_up: Optional[date] = None
    next_action_date: Optional[date] = None

    job_link: Optional[str] = None
    contact_name: Optional[str] = None
    contact_email: Optional[str] = None
    notes: Optional[str] = None

app = FastAPI(title="Job Tracker API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    SQLModel.metadata.create_all(engine)

@app.get("/health")
def health():
    return {"ok": True}

@app.get("/applications", response_model=List[Application])
def list_applications(
    q: Optional[str] = Query(default=None, description="Search company/role/city"),
    status: Optional[str] = None,
    city: Optional[str] = None,
):
    with Session(engine) as session:
        stmt = select(Application)

        if status:
            stmt = stmt.where(Application.status == status)
        if city:
            stmt = stmt.where(Application.city == city)
        if q:
            like = f"%{q.strip()}%"
            stmt = stmt.where(
                (Application.company.like(like))
                | (Application.role_title.like(like))
                | (Application.city.like(like))
            )

        stmt = stmt.order_by(Application.id.desc())
        return session.exec(stmt).all()

@app.post("/applications", response_model=Application)
def create_application(app_in: Application):
    with Session(engine) as session:
        session.add(app_in)
        session.commit()
        session.refresh(app_in)
        return app_in

@app.put("/applications/{app_id}", response_model=Application)
def update_application(app_id: int, patch: Application):
    with Session(engine) as session:
        app_row = session.get(Application, app_id)
        if not app_row:
            raise HTTPException(status_code=404, detail="Application not found")

        patch_data = patch.model_dump(exclude_unset=True)
        for k, v in patch_data.items():
            if v is not None:
                setattr(app_row, k, v)

        session.add(app_row)
        session.commit()
        session.refresh(app_row)
        return app_row

@app.delete("/applications/{app_id}")
def delete_application(app_id: int):
    with Session(engine) as session:
        app_row = session.get(Application, app_id)
        if not app_row:
            raise HTTPException(status_code=404, detail="Application not found")
        session.delete(app_row)
        session.commit()
        return {"deleted": True, "id": app_id}
