import {
	combineLatest,
	concatAll,
	concatMap,
	forkJoin,
	from,
	interval,
	map,
	mergeMap,
	of,
	startWith,
	switchMap,
	take,
	tap,
	toArray,
} from "rxjs";
import { ajax } from "rxjs/ajax";
import { fromAjax } from "rxjs/internal/ajax/ajax";
const URL = "https://jsonplaceholder.typicode.com/users/";
export interface User {
	id: number;
	name: string;
	username: string;
	email: string;
	address: Address;
	phone: string;
	website: string;
	company: Company;
}

export interface Address {
	street: string;
	suite: string;
	city: string;
	zipcode: string;
	geo: Geo;
}

export interface Geo {
	lat: string;
	lng: string;
}

export interface Company {
	name: string;
	catchPhrase: string;
	bs: string;
}

const getUsers = () =>
	fetch(URL).then((res) => {
		return res.json() as Promise<User[]>;
	});

const getUser = (userId: number) =>
	fetch(`${URL}/${userId.toString()}`).then((res) => {
		return res.json() as Promise<User>;
	});

const userIds$ = of(1, 2, 3, 4);

const fourSeconds = interval(1000);

userIds$.pipe(
	mergeMap((userId) => from(getUser(userId))),
	map((user) => ({
		...user,
		fullName: user.name + " " + user.username,
	})),
	toArray()
);

const usersTable$ = from(getUsers());
const users$ = usersTable$.pipe(
	mergeMap((users) => users.map((user) => from(getUser(user.id)))),
	concatAll()
);

combineLatest([usersTable$, users$])
	.pipe(
		map(([lookUpUsers, user]) => ({
			...user,
			...lookUpUsers.find((tableUser) => tableUser.id === user.id),
		}))
	)
	.subscribe(console.log);
