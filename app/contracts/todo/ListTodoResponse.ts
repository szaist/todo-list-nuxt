
// todos: pageItems,
//         pagination: {
//             currentPage: page * 1,
//             totalCount: todos.length,
//             totalPages: totalPages,

import type { Todo } from "~/app/models/Todo"

//         }
export type ListTodoResponse = {
    todos: Todo[]
    pagination: {
        currentPage: number
        totalCount: number
        totalPages: number
    }
}