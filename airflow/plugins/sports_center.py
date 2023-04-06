from datetime import timedelta

import pendulum
from airflow.plugins_manager import AirflowPlugin
from airflow.timetables.base import (DagRunInfo, DataInterval, TimeRestriction,
                                     Timetable)
from pendulum import UTC, DateTime, Time

taipei = pendulum.timezone("Asia/Taipei")
minutes_interval = 10  # Time interval to run this DAG (in minutes)
sport_center_open = Time(hour=6)
first_start_per_day = sport_center_open - timedelta(minutes=minutes_interval)
sport_center_close = Time(hour=22)
last_start_per_day = sport_center_close - timedelta(minutes=minutes_interval)


class SportsCenterTimetable(Timetable):
    def infer_manual_data_interval(self, run_after: DateTime) -> DataInterval:
        run_after = run_after.in_timezone(taipei)
        print("in infer_manual_data_interval")
        print(f"run_after (taipei): {run_after}")
        hour = run_after.hour
        minute = run_after.minute

        if hour in (22, 23):
            date = run_after.date()
            time = sport_center_close - timedelta(minutes=minutes_interval)
        elif 0 <= hour < 6:
            date = run_after.date() - timedelta(days=1)
            time = sport_center_close - timedelta(minutes=minutes_interval)
        else:
            date = run_after.date()
            minutes_since_last_start = 10 + (minute % 10)
            time = Time(hour=hour, minute=minute) - timedelta(minutes=minutes_since_last_start)
        start = DateTime.combine(date, time).replace(tzinfo="Asia/Taipei")
        print(f"start (taipei): {start}")
        start = start.in_timezone(UTC)
        return DataInterval(start=start, end=(start + timedelta(minutes=minutes_interval)))

    def next_dagrun_info(
        self,
        *,
        last_automated_data_interval,
        restriction: TimeRestriction,
    ):
        print("next_dagrun_info")
        # TODO: 官方對 catchup 描述的寫法和我所想的不一樣？
        if not restriction.catchup:
            next_start = restriction.earliest
            next_start = next_start.in_timezone(taipei)
            now = DateTime.now().in_timezone("Asia/Taipei")
            print(f"now: {now}")
            minutes_since_this_start = now.minute % 10
            time = Time(now.hour, now.minute) - timedelta(minutes=minutes_since_this_start)
            next_start = max(next_start,
                             DateTime.combine(now.date(), time).replace(tzinfo="Asia/Taipei"))
        elif last_automated_data_interval is not None:
            last_start = last_automated_data_interval.start
            last_start = last_start.in_timezone(taipei)
            next_start = last_start + timedelta(minutes=10)
            print(f"last exist & next_start (taipei): {next_start}")
        else:
            next_start = restriction.earliest
            if next_start is None:
                return None
            next_start = next_start.in_timezone(taipei)
            if not restriction.catchup:
                now = DateTime.now().in_timezone("Asia/Taipei")
                print(f"now: {now}")
                minutes_since_this_start = now.minute % 10
                time = Time(now.hour, now.minute) - timedelta(minutes=minutes_since_this_start)
                next_start = max(next_start,
                                 DateTime.combine(now.date(), time).replace(tzinfo="Asia/Taipei"))
            elif next_start.minute % 10 != 0:
                minutes_to_next_start = 10 - (next_start.minute % 10)
                # TODO: 這裡可能會出問題
                # 如果 next_start 的 minute 不是設定為 10 分鐘的倍數單位，就不能這樣直接加
                next_start = next_start + timedelta(minutes=minutes_to_next_start)
            print(f"last not exist & next_start (taipei): {next_start}")
        next_start_time = next_start.time()
        if next_start_time < first_start_per_day:
            date = next_start.date()
            next_start = DateTime.combine(
                date, sport_center_open - timedelta(minutes=minutes_interval)).replace(tzinfo="Asia/Taipei")
        elif next_start_time > last_start_per_day:
            date = next_start.date() + timedelta(days=1)
            next_start = DateTime.combine(
                date, sport_center_open - timedelta(minutes=minutes_interval)).replace(tzinfo="Asia/Taipei")
        next_start = next_start.in_timezone(UTC)
        if restriction.latest and next_start > restriction.latest:
            return None
        print(f"next_start (UTC): {next_start}")
        return DagRunInfo.interval(start=next_start, end=(next_start + timedelta(minutes=minutes_interval)))


class SportsCenterTimetablePlugin(AirflowPlugin):
    name = "sports_center_timetable_plugin"
    timetables = [SportsCenterTimetable]
