@file:JvmName(name = "Main")

package com.developersam

import com.google.gson.Gson
import samlang.demo.WebDemoController
import spark.Spark.get
import spark.Spark.port
import spark.Spark.post
import java.util.concurrent.Executors

fun main() {
    val gson = Gson()
    val threadFactory = Executors.defaultThreadFactory()
    port(System.getenv("PORT")?.toIntOrNull() ?: 8080)
    get("/") { _, _ -> "OK" }
    post("/api/respond", { req, _ ->
        WebDemoController.interpret(programString = req.body(), threadFactory = threadFactory)
    }, gson::toJson)
}
