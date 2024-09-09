import { Request, Response } from "express";
import MeetingModel from "../model/meeting-model";
import { isNil, toInteger } from "lodash";
import { Meeting } from "@prisma/client";

const meetingModel = new MeetingModel();

export default class MeetingController {
    post = async(req: Request, res: Response): Promise<void> => {
        try {
            const body: Meeting = req.body;
            const meeting = await meetingModel.post(body);

            res.status(200).json({
                meeting: {
                    id: meeting.id,
                    name: meeting.name,
                    description: meeting.description,
                    startDate: meeting.startDate,
                    endDate: meeting.endDate,
                },
            });
        } catch(e) {
            res.status(400).json({
                error: e,
            });
        }
    };

    getById = async(req: Request, res: Response): Promise<void> => {
        try {
            const id: string = req.params.id;

            const meeting = await meetingModel.getById(toInteger(id));

            if(!isNil(meeting)) {
                res.status(200).json(meeting);
            } else {
                res.status(404).json({
                    error: "Meeting not found",
                });
            }
        } catch (e) {
            res.status(500).json({
                error: e,
            });
        }
    };

    getAll = async(req: Request, res: Response): Promise<void> =>{
        try{
            
            const meeting = await meetingModel.getAll();

            if(meeting.length > 0)
            {
                res.status(200).json(meeting);
            }
            else
            {
                res.status(404).json({
                    error: "No meetings found",
                });
            }
        } catch(e) {
            res.status(500).json({
                error: e,
            });
        }
    };

    update = async(req: Request, res: Response): Promise<void> => {
        try{
            const body: Meeting = req.body;
            const id: string = req.params.id;
            
            const meeting = await meetingModel.update(toInteger(id), body);

            res.status(200).json({
                meeting:{
                    name: meeting.name,
                    description: meeting.description,
                    startDate: meeting.startDate,
                    endDate: meeting.endDate,
                }
            });
        }catch(e) {
            res.status(400).json({
                error: e,
            });
        }
    };

    delete = async(req: Request, res: Response): Promise<void> => {
        try{
            const id: string = req.params.id;

            const meeting = await meetingModel.delete(toInteger(id));

            if(!isNil(meeting)) {
                res.status(200).json(meeting);
            }
            else{
                res.status(400).json({
                    error: "Meeting not found",
                });
            }
        } catch(e) {
            res.status(500).json({
                error: e,
            });
        }
    };
}