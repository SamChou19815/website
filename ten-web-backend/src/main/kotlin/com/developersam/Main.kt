@file:JvmName(name="Main")

package com.developersam

import com.developersam.game.ten.Board
import com.developersam.game.ten.BoardData
import com.google.gson.Gson
import spark.Spark.get
import spark.Spark.port
import spark.Spark.post

fun main() {
    val gson = Gson()
    port(System.getenv("PORT")?.toIntOrNull() ?: 8080)
    get("/") { _, _ -> "OK" }
    post("/api/respond", { req, _ ->
        val boardData = gson.fromJson(req.body(), BoardData::class.java)
        Board.respondToClient(boardData)
    }, gson::toJson)
}
