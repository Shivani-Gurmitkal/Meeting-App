import React, { useContext, useEffect, useRef, useState } from 'react'
import MeetingContext from '@/context/MeetingContext'
import { Link } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import axios from 'axios'

function NavBar() {
    const {setMeetings} = useContext(MeetingContext);
    let url = 'https://meeting-6584e-default-rtdb.asia-southeast1.firebasedatabase.app/'
    const [date, setDate] = React.useState();
    const topicInput = useRef(null);
    const linkInput = useRef(null);

    function handleSubmit(){
        let meetingTopic = topicInput.current.value;
        let meetingLink = linkInput.current.value;
        if (!meetingTopic || !date || !meetingLink) {
            alert("Please provide a topic, link and select a date.");
            return;
        }
        axios.post(`${url}meeting.json`,{
            topic: meetingTopic,
            link: meetingLink,
            date: date,
        }).then(()=>{
            fetchData();
            setDate(null);
        })
    }

    function fetchData(){
        axios.get(`${url}meeting.json`).then(meeting=>{
            let meetTask =[];
            for(let key in meeting.data){
                let meet = {
                    id:key,
                    ...meeting.data[key]
                }
                meetTask.push(meet);
            }
            setMeetings(meetTask);
        })
    }

    useEffect(()=>{
        fetchData(); 
    }, [])
  
  return (
    <div>

      <div className="border-b py-3 border-neutral-500">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
            <Link to="/">Meeting App</Link>
            <div className="flex gap-4 items-center">
                <Link to="/previous">Previous meetings</Link>
                <Sheet>
                    <SheetTrigger asChild>
                    <Button variant="outline">Schedule</Button>
                    </SheetTrigger>
                    <SheetContent>
                        <SheetHeader>
                            <SheetTitle>Add New Meeting</SheetTitle>
                                <SheetDescription>
                                    Create new meeting with your members. Click save when you're done.
                                </SheetDescription>
                        </SheetHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                            Topic
                            </Label>
                        <Input id="name" ref={topicInput} placeholder="Meeting Title" className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                            Link
                            </Label>
                        <Input id="name" ref={linkInput} placeholder="Meeting Link" className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="username" className="text-right">
                            Date
                            </Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                        "col-span-3 justify-start text-left font-normal gap-2",
                                        !date && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon />
                                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={setDate}
                                    initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                    <SheetFooter>
                        <SheetClose asChild>
                            <Button onClick={handleSubmit}>Create meeting</Button>
                        </SheetClose>
                    </SheetFooter>
                    </SheetContent>
                </Sheet>
            </div>
        </div>
      </div>

    </div>
  )
}

export default NavBar
