package com.developersam.web;

import com.google.appengine.api.ThreadManager;
import com.google.gson.Gson;
import samlang.demo.WebDemoController;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.concurrent.ThreadFactory;
import java.util.stream.Collectors;

public class ResponseServlet extends HttpServlet {

    private static final Gson GSON = new Gson();
    private static final ThreadFactory FACTORY = ThreadManager.currentRequestThreadFactory();

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        BufferedReader reader = new BufferedReader(new InputStreamReader(req.getInputStream()));
        String programString = reader.lines().collect(Collectors.joining("\n"));
        WebDemoController.Response response = WebDemoController.interpret(programString, FACTORY);
        GSON.toJson(response, resp.getWriter());
    }

}
