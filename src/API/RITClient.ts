import axios, { AxiosInstance } from 'axios';
import { APICurrentTerm } from './CurrentTerm/APICurrentTerm';
import { APIUser } from './Users/APIUser';
import { APICourse } from './Courses/APICourse';
import { APIMeeting } from './Meetings/APIMeeting';
import { APIRoom } from './Rooms/APIRoom';
import { APIBuilding } from './Buildings/APIBuilding';
import { Building } from '../RIT.TS/Objects/Building';

export class RITClient {


    private readonly RITAPI: AxiosInstance = axios.create({
        baseURL: 'https://api.rit.edu',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    constructor(private readonly key: string) {
        this.RITAPI.defaults.headers.common['RITAuthorization'] = `${this.key}`;
    }
    /**
     * Access the RIT API to get information about the current term.
     */
    public getCurrentTerm = async (): Promise<APICurrentTerm | null> => {
        const response = await this.RITAPI.get('/currentTerm');
        return response.data;
    }
    /**
     * Access the RIT API to get information about a user.
     */
    public getUser = async (username: string): Promise<APIUser | null> => {
        const response = await this.RITAPI.get(`/faculty/${username}`);
        if (response) {
            return response.data.data;
        }
        return null;

    }
    /**
    * Access the RIT API to get a user's courses.
    * **WHY IS THIS SO SLOW**
    */
    public getUserCourses = async (username: string): Promise<APICourse[] | null> => {
        const response = await this.RITAPI.get(`/faculty/${username}/courses`);
        return response.data;
    }
    /**
     * Access the RIT API to get information about a room.
     */
    public getRoom = async (id: string): Promise<APIRoom | null> => {
        const response = await this.RITAPI.get(`/rooms/${id}`);
        if (response.data.data.length == 1) {
            return response.data.data[0]
        } else {
            return null;
        }
    }
    /**
     * Access the RIT API to get information about a building.
     */
    public getBuilding = async (code: string): Promise<APIBuilding | null> => {
        const response = await this.RITAPI.get(`/buildings`);
        if (response.data.data) {
            const foundBuilding:APIBuilding = response.data.data.find((Building:APIBuilding) => {
                return Building.building == code
            })
            return foundBuilding;
        } else {
            return null;
        }
    }
    /**
     * Access the RIT API to get all buildings
     */
    public getAllBuildings = async (): Promise<APIBuilding[] | null> => {
            const response = await this.RITAPI.get(`/buildings`);
            return response.data.data??null
 
    }
    /**
    * Access the RIT API to get the meetings that occur in a room.
    * @param id The ID of the Room
    * @param startDate An optional start date of the search (y-m-d)
    * @param endDate An optional end date of the search (y-m-d)
    */
    public getMeetingsInRoom = async (id: string, startDate?: string, endDate?: string): Promise<APIMeeting[] | null> => {
        let url = `/v2/rooms/${id}/meetings`
        const response = await this.RITAPI.get(url, {
            params: {
                date_start: startDate,
                date_end: endDate,
            }
        });

        return response.data;
    }
    /**
    * Access the RIT API to get the meetings that occur in a building.
    * @param buildingNumber The number of the building
    * @param startDate An optional start date of the search (y-m-d)
    * @param endDate An optional end date of the search (y-m-d)
    */
    public getMeetingsInBuilding = async (buildingNumber: string, startDate?: string, endDate?: string): Promise<APIMeeting[] | null> => {
        let url = `/v2/buildings/${buildingNumber}/meetings`
        const response = await this.RITAPI.get(url, {
            params: {
                date_start: startDate,
                date_end: endDate,
            }
        });

        return response.data;
    }
    /**
     * Access the RIT API to get information about a course.
     * 
     * @param courseWithSection the course and section to get information about
     * (ex: GCIS-123-02)
     * @param term optional term to get information about (ex: 2131)
     */
    public getCourse = async (courseWithSection: string, term?: string): Promise<APICourse | null> => {
        let reqURL = `/course/${courseWithSection}`;
        if (term) {
            reqURL += `?term=${term}`;
        }
        const response = await this.RITAPI.get(reqURL);
        if (response.data.term == null) {
            return null;
        }
        return response.data;
    }

}