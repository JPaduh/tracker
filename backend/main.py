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

class ApplicationCreate(SQLModel):
    company: str
    role_title: str
    city: Optional[str] = None
    work_mode: str = "Hybrid"
    status: str = "Applied"

    # accept strings from the browser
    date_applied: Optional[str] = None
    last_follow_up: Optional[str] = None
    next_action_date: Optional[str] = None

    job_link: Optional[str] = None
    contact_name: Optional[str] = None
    contact_email: Optional[str] = None
    notes: Optional[str] = None


class ApplicationPatch(SQLModel):
    company: Optional[str] = None
    role_title: Optional[str] = None
    city: Optional[str] = None
    work_mode: Optional[str] = None
    status: Optional[str] = None

    # accept strings from the browser
    date_applied: Optional[str] = None
    last_follow_up: Optional[str] = None
    next_action_date: Optional[str] = None

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
    
def parse_date(value: Optional[str]) -> Optional[date]:
    if value is None or value == "":
        return None
    return date.fromisoformat(value)

@app.post("/applications", response_model=Application)
def create_application(app_in: ApplicationCreate):
    app_row = Application(
        company=app_in.company,
        role_title=app_in.role_title,
        city=app_in.city,
        work_mode=app_in.work_mode,
        status=app_in.status,
        date_applied=parse_date(app_in.date_applied),
        last_follow_up=parse_date(app_in.last_follow_up),
        next_action_date=parse_date(app_in.next_action_date),
        job_link=app_in.job_link,
        contact_name=app_in.contact_name,
        contact_email=app_in.contact_email,
        notes=app_in.notes,
    )

    with Session(engine) as session:
        session.add(app_row)
        session.commit()
        session.refresh(app_row)
        return app_row

@app.put("/applications/{app_id}", response_model=Application)
def update_application(app_id: int, patch: ApplicationPatch):
    with Session(engine) as session:
        app_row = session.get(Application, app_id)
        if not app_row:
            raise HTTPException(status_code=404, detail="Application not found")

        patch_data = patch.model_dump(exclude_unset=True)

        # handle date strings explicitly
        if "date_applied" in patch_data:
            app_row.date_applied = parse_date(patch_data.pop("date_applied"))
        if "last_follow_up" in patch_data:
            app_row.last_follow_up = parse_date(patch_data.pop("last_follow_up"))
        if "next_action_date" in patch_data:
            app_row.next_action_date = parse_date(patch_data.pop("next_action_date"))

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
