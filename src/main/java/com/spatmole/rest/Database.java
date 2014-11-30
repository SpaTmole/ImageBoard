package com.spatmole.rest;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import com.mysql.jdbc.Driver;


public class Database
{
    public Connection Get_Connection(String db_name) throws Exception
    {
        try
        {
            String connectionURL = "jdbc:mysql://localhost:3306/" + db_name;
            Connection connection = null;
            Class.forName("com.mysql.jdbc.Driver").newInstance();
            connection = DriverManager.getConnection(connectionURL, "root", "");
            return connection;
        }
        catch (SQLException e)
        {
            throw e;
        }
        catch (Exception e)
        {
            throw e;
        }
    }
}