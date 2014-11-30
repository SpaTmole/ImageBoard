package com.spatmole.rest;

import java.sql.Blob;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.io.InputStream;
import sun.misc.BASE64Encoder;

public class DatabaseJoint
{
    public static final String db_name = "photoAlbum";
    private Connection connection;

    public DatabaseJoint(){
        Database db = new Database();
        try {
            connection = db.Get_Connection(db_name);
        } catch (Exception e){
            connection = null;
        }
    }

    public AlbumRecord GetCard(Integer id) throws Exception{
        try {
            PreparedStatement ps = connection.prepareStatement(
                    "SELECT idPhotoCard, description, photo " +
                    "FROM PhotoCard " +
                    "WHERE idPhotoCard=?");
            ps.setInt(1, id);
            ResultSet rs = ps.executeQuery();
            if(rs.next()){
                Blob blob = rs.getBlob("photo");
                byte[] bdata = blob.getBytes(1, (int) blob.length());
                BASE64Encoder encoder = new BASE64Encoder();
                String text = encoder.encodeBuffer(bdata);
                return new AlbumRecord(
                        id,
                        rs.getString("description"),
                        text
                );
            } else {
                return null;
            }
        } catch (Exception e) {
            throw e;
        }
    }

    public ArrayList<AlbumRecord> GetFeeds() throws Exception
    {
        ArrayList<AlbumRecord> feedData = new ArrayList<AlbumRecord>();
        try {
            PreparedStatement ps = connection.prepareStatement("SELECT idPhotoCard, description, photo FROM PhotoCard ORDER BY idPhotoCard DESC");
            ResultSet rs = ps.executeQuery();
            while(rs.next())
            {
                Blob blob = rs.getBlob("photo");
                byte[] bdata = blob.getBytes(1, (int) blob.length());
                BASE64Encoder encoder = new BASE64Encoder();
                String text = encoder.encodeBuffer(bdata);
                feedData.add(new AlbumRecord(
                        rs.getInt("idPhotoCard"),
                        rs.getString("description"),
                        text));
            }
            return feedData;
        }
        catch(Exception e)
        {
            throw e;
        }
    }

    public Boolean InsertMessage(String description, InputStream photo) throws Exception {
        try {
            PreparedStatement ps = connection.prepareStatement("INSERT INTO PhotoCard(description, photo) VALUES(?, ?)");
            ps.setString(1, description);
            if(photo != null)
                ps.setBinaryStream(2, photo);
            else
                ps.setString(2, "");
            return ps.executeUpdate() > 0;
        } catch (Exception e) {
            throw e;
        }
    }


}