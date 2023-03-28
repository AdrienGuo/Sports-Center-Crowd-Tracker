from datetime import datetime, timedelta

import requests
from airflow.operators.python import PythonOperator
from airflow.providers.postgres.operators.postgres import PostgresOperator
from airflow.utils.dates import days_ago

from airflow import DAG

default_args = {
    "owner": "adrien guo",
    "retries": 5,
    "retry_delay": timedelta(minutes=5)
}

API = "https://zlcsc.cyc.org.tw/api"


def greet():
    print("Hello World!")


def crawl_center_people(ti):
    data = requests.get(API).json()
    print(data)

    gym = data['gym']
    swim = data['swim']
    gym_people_num = gym[0]
    swim_people_nume = swim[0]

    print(gym_people_num)
    print(swim_people_nume)

    ti.xcom_push(key="gym_people_num", value=gym_people_num)
    ti.xcom_push(key="swim_people_num", value=swim_people_nume)


with DAG(
    default_args=default_args,
    dag_id="crawl",
    description="my first dag",
    start_date=days_ago(0),
    schedule_interval="*/10 * * * *",  # https://crontab.guru/every-10-minutes
    catchup=False
) as dag:
    crawl_center_people_task = PythonOperator(
        task_id="crawl_center_people",
        python_callable=crawl_center_people
    )
    create_table = PostgresOperator(
        task_id="create_postgres_table",
        postgres_conn_id="postgres_localhost",
        sql="""
            create table if not exists people (
                time timestamp PRIMARY KEY,
                gym_people int NOT NULL,
                swim_people int NOT NULL
            )
        """
    )
    insert_table = PostgresOperator(
        task_id="insert_into_table",
        postgres_conn_id="postgres_localhost",
        sql="""
            insert into people (time, gym_people, swim_people)
            values ('{{ ts }}', '{{ ti.xcom_pull(task_ids="crawl_center_people", key="gym_people_num") }}', '{{ ti.xcom_pull(task_ids="crawl_center_people", key="swim_people_num") }}');
        """
    )

    crawl_center_people_task >> create_table >> insert_table
