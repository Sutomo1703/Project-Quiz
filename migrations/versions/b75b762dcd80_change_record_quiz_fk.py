"""change record_quiz FK

Revision ID: b75b762dcd80
Revises: 52e8205e31ef
Create Date: 2022-10-20 11:12:50.989687

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'b75b762dcd80'
down_revision = '52e8205e31ef'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('record_quiz', sa.Column('quiz_instance_id', sa.Integer(), nullable=True))
    op.drop_constraint('record_quiz_quiz_id_fkey', 'record_quiz', type_='foreignkey')
    op.create_foreign_key(None, 'record_quiz', 'quiz_instance', ['quiz_instance_id'], ['id'])
    op.drop_column('record_quiz', 'quiz_id')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('record_quiz', sa.Column('quiz_id', sa.INTEGER(), autoincrement=False, nullable=True))
    op.drop_constraint(None, 'record_quiz', type_='foreignkey')
    op.create_foreign_key('record_quiz_quiz_id_fkey', 'record_quiz', 'quiz', ['quiz_id'], ['id'])
    op.drop_column('record_quiz', 'quiz_instance_id')
    # ### end Alembic commands ###
