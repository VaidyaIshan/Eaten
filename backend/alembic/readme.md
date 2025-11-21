alembic commands
alembic revision --autogenerate -m "msg"
alembic upgrade head
alembic history


MUST generate one migration per change to your SQLAlchemy models. All changes after FEEADBACK table must have migration scripts

eg. Aarush and Shreyansh Work on Different models for tables on the same day. 
1. One who is the first to make a PUll request will run alembic revision --autogenerate -m "" Command. 
2. And RUN alembic upgrade head
3. Then make a pr request (Here a new migration script will be made)
4. If i merge, then the second person MUST 'git pull origin main' immediately.
5. Then run alembic upgrade head (Second person will do this after pulling)
6. Then if their models code is complete run 'alembic revision --autogenerate -m' command
7. Then only they should make a pr.


CASES FOR PROBLEMS IN 'alembic revision --autogenerate -m "msg" ' COMMAND
1. Adding a Column With Existing Data
 -> Add the new column as nullable=True 

2. Renaming a Column (Preserving Data):
 -> In migration script study and write similar code for altering table
 def upgrade():
    op.alter_column("users", "fullname",
                    new_column_name="full_name")

3. Changing Data Type With Existing Data

Example: String → Integer

Strategy:
	->	Create a new temp column
	->	Convert + copy data in SQL
	->	Drop old column
	->	Rename new column to old name

4. Dropping a Column With Data
op.drop_column("users", "old_column")

                    