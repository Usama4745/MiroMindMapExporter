import { getUserIdFromRequest } from "../../../utils/user";
import { NextResponse } from "next/server";
import { supabase } from '../../../utils/supabase';

export async function GET() {
  console.log('API called at:', new Date().toISOString());

  const userId = await getUserIdFromRequest();
  // console.log("get user udgg   here")
  // console.log(userId)
  if (userId && userId!.user!) {
    const { data, error } = await supabase
      .from(process.env.UserTable!)
      .select('*')
      .eq('user_id', userId!.user)

    if (!data || data.length == 0) {
      // console.log("data check")
      const { data } = await supabase.from(process.env.UserTable!).upsert({
        user_id: userId!.user,
      }).select()
      await supabase.from(process.env.TeamTable!).upsert({
        user_id: userId!.user,
        team_id: userId!.team,
      })

      if (error) {
        return NextResponse.json({ userId: userId!.user, record: {}, traildays: 0 });
      } else {
        return NextResponse.json({ userId: userId!.user, record: data, traildays: 0 });
      }
    }

    if (userId!.team) {
      const { data, error } = await supabase
        .from(process.env.TeamTable!)
        .select('*')
        .eq('team_id', userId!.team)

      if (error) {
        console.log(error)
      }
      if (!data || data.length == 0) {
        await supabase.from(process.env.TeamTable!).upsert({
          user_id: userId!.user,
          team_id: userId!.team
        })
      }
    }
    const createdDate = data?.[0]?.created_at ? new Date(data[0].created_at) : new Date();
    const todayDate = new Date();

    const daysDifference = calculateDayDifference(createdDate, todayDate);

    if (error) {
      return NextResponse.json({ userId: userId!.user, record: {}, traildays: 0 });
    } else {
      return NextResponse.json({ userId: userId!.user, record: data, traildays: daysDifference });
    }
  } else {
    return NextResponse.json({ userId: 0, record: {}, traildays: 0 });

  }

}

function calculateDayDifference(timestamp1: string | number | Date, timestamp2: string | number | Date) {
  // Create Date objects from timestamps
  const date1 = new Date(timestamp1).valueOf();
  const date2 = new Date(timestamp2).valueOf();

  // Calculate the difference in time (milliseconds)
  const timeDifference = Math.abs(date2 - date1);

  // Convert milliseconds to days (1000 ms = 1 second, 60 seconds = 1 minute, 60 minutes = 1 hour, 24 hours = 1 day)
  const dayDifference = timeDifference / (1000 * 60 * 60 * 24);

  return dayDifference;
}
