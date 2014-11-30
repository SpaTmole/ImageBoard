package com.spatmole.rest;

import javax.ws.rs.*;

import javax.ws.rs.core.MediaType;
//import javax.ws.rs.core.Response;
import java.io.InputStream;
import java.util.ArrayList;

import com.sun.jersey.multipart.FormDataBodyPart;
import com.sun.jersey.multipart.FormDataMultiPart;


@Path("/card")
public class MainHandler {

    private static final String img_url = "/rest/img/";
 
	@GET
	@Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
	public AlbumRecord getCard(@PathParam("id") Integer id) throws WebApplicationException {
		if(id != null && id >= 1){
            DatabaseJoint db = new DatabaseJoint();
            try {
                return db.GetCard(id);
            } catch (Exception e){
                throw new WebApplicationException(404);
            }
        }
        return null;
	}

    @GET
    @Path("/")
    @Produces(MediaType.APPLICATION_JSON)
    public ArrayList<AlbumRecord> getAll() throws WebApplicationException{
        DatabaseJoint db = new DatabaseJoint();
        try {
            return db.GetFeeds();
        } catch (Exception e){
            throw new WebApplicationException(404);
        }
    }

    @POST
    @Path("/")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    public void saveCard(FormDataMultiPart form) throws WebApplicationException {
        FormDataBodyPart filePart = form.getField("photo");
        FormDataBodyPart descriptionPt = form.getField("description");
        InputStream fileInputStream;
        try {
            fileInputStream = filePart.getValueAs(InputStream.class);
        } catch (NullPointerException e){
            fileInputStream = null;
        }
        String description_val = descriptionPt.getValueAs(String.class);
        if(description_val.length() == 0 && fileInputStream == null){
            throw new WebApplicationException(404);
        }
        DatabaseJoint db = new DatabaseJoint();
        try {
            if (!db.InsertMessage(description_val, fileInputStream)){
                throw new WebApplicationException(404);
            }
        } catch (Exception e){
            throw new WebApplicationException(404);
        }
    }

}