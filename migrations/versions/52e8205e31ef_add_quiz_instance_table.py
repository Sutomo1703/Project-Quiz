"""add quiz_instance table

Revision ID: 52e8205e31ef
Revises: 5a0bb7a98cb7
Create Date: 2022-10-20 10:53:34.553305

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '52e8205e31ef'
down_revision = '5a0bb7a98cb7'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('quiz_instance',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('createdBy', sa.Integer(), nullable=True),
    sa.Column('createdAt', sa.DateTime(timezone=True), nullable=True),
    sa.Column('editedBy', sa.Integer(), nullable=True),
    sa.Column('editdedAt', sa.DateTime(timezone=True), nullable=True),
    sa.Column('quiz_id', sa.Integer(), nullable=True),
    sa.Column('status', sa.Text(), nullable=False),
    sa.Column('start_date', sa.DateTime(timezone=True), nullable=False),
    sa.Column('end_date', sa.DateTime(timezone=True), nullable=False),
    sa.ForeignKeyConstraint(['quiz_id'], ['quiz.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('quiz_instance')
    # ### end Alembic commands ###
